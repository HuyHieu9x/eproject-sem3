using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Shopv2.Data;
using Shopv2.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Shopv2.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/bouquets")]
    public class BouquetsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public BouquetsController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // 1. READ - Bouquets List (With Search, Pagination & Alerts)
        [HttpGet("")]
        public IActionResult Index(string searchString, int page = 1)
        {
            int pageSize = 10; // Maximum items per view sequence
            var query = _context.Bouquets.AsQueryable();

            // Search Strategy: Filter by Bouquet Name
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(b => b.Name.Contains(searchString));
                ViewBag.CurrentFilter = searchString;
            }

            // Pagination Math Matrix
            int totalItems = query.Count();
            int totalPages = (int)System.Math.Ceiling((double)totalItems / pageSize);

            if (page < 1) page = 1;
            if (page > totalPages && totalPages > 0) page = totalPages;

            var bouquets = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.Occasions = _context.Occasions.ToDictionary(o => o.Id, o => o.Name);

            return View(bouquets);
        }

        // 2. CREATE - Add View Layout
        [HttpGet("create")]
        public IActionResult Create()
        {
            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name");
            return View();
        }

        [HttpPost("create")]
        public IActionResult Create(Bouquet bouquet, List<IFormFile>? ImageFiles)
        {
            try
            {
                bouquet.CreatedAt = DateTime.Now;

                if (ImageFiles != null && ImageFiles.Count > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    var imagePaths = new List<string>();
                    foreach (var file in ImageFiles)
                    {
                        if (file.Length > 0)
                        {
                            // 1. Lấy phần mở rộng của file (ví dụ: .jpg, .png)
                            string extension = Path.GetExtension(file.FileName);

                            // 2. Lấy tên file gốc không chứa đuôi mở rộng
                            string originalFileName = Path.GetFileNameWithoutExtension(file.FileName);

                            // 3. Tạo chuỗi thời gian hiện tại chính xác đến từng phần nghìn giây
                            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");

                            // 4. Kết hợp lại thành tên file mới: TênGốc_ChuỗiThờiGian.đuôi
                            string uniqueFileName = $"{originalFileName}_{timestamp}{extension}";

                            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                            using (var fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                file.CopyTo(fileStream);
                            }
                            imagePaths.Add("/images/" + uniqueFileName);

                            // Thêm một khoảng trễ cực nhỏ (1 milisecond) để tránh trường hợp 
                            // các file trong cùng một vòng lặp bị trùng khít phần nghìn giây
                            System.Threading.Thread.Sleep(1);
                        }
                    }
                    bouquet.ImageUrl = string.Join(",", imagePaths);
                }

                _context.Bouquets.Add(bouquet);
                _context.SaveChanges();

                TempData["AlertMessage"] = "Bouquet created successfully!";
                TempData["AlertType"] = "success";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception)
            {
                TempData["AlertMessage"] = "Failed to create bouquet due to a database processing error.";
                TempData["AlertType"] = "danger";
                ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", bouquet.OccasionId);
                return View(bouquet);
            }
        }

        // 3. UPDATE - Edit View Layout
        [HttpGet("edit/{id}")]
        public IActionResult Edit(int id)
        {
            var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
            if (bouquet == null) return NotFound();

            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", bouquet.OccasionId);
            return View(bouquet);
        }

        [HttpPost("edit/{id}")]
        public IActionResult Edit(Bouquet bouquet, List<IFormFile>? ImageFiles)
        {
            try
            {
                var existingBouquet = _context.Bouquets.FirstOrDefault(b => b.Id == bouquet.Id);
                if (existingBouquet == null) return NotFound();

                existingBouquet.Name = bouquet.Name;
                existingBouquet.Description = bouquet.Description;
                existingBouquet.Price = bouquet.Price;
                existingBouquet.OccasionId = bouquet.OccasionId;
                existingBouquet.IsActive = bouquet.IsActive;

                if (ImageFiles != null && ImageFiles.Count > 0)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    // Xóa toàn bộ ảnh cũ trên server
                    if (!string.IsNullOrEmpty(existingBouquet.ImageUrl))
                    {
                        var oldPaths = existingBouquet.ImageUrl.Split(',');
                        foreach (var oldPath in oldPaths)
                        {
                            string fullOldPath = Path.Combine(_webHostEnvironment.WebRootPath, oldPath.TrimStart('/'));
                            if (System.IO.File.Exists(fullOldPath)) System.IO.File.Delete(fullOldPath);
                        }
                    }

                    var newImagePaths = new List<string>();
                    foreach (var file in ImageFiles)
                    {
                        if (file.Length > 0)
                        {
                            // Áp dụng cấu trúc đặt tên theo thời gian tương tự khi Create
                            string extension = Path.GetExtension(file.FileName);
                            string originalFileName = Path.GetFileNameWithoutExtension(file.FileName);
                            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");

                            string uniqueFileName = $"{originalFileName}_{timestamp}{extension}";
                            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                            using (var fileStream = new FileStream(filePath, FileMode.Create))
                            {
                                file.CopyTo(fileStream);
                            }
                            newImagePaths.Add("/images/" + uniqueFileName);

                            System.Threading.Thread.Sleep(1);
                        }
                    }
                    existingBouquet.ImageUrl = string.Join(",", newImagePaths);
                }

                _context.Bouquets.Update(existingBouquet);
                _context.SaveChanges();

                TempData["AlertMessage"] = "Bouquet details updated successfully!";
                TempData["AlertType"] = "success";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception)
            {
                TempData["AlertMessage"] = "An error occurred while updating the bouquet record.";
                TempData["AlertType"] = "danger";
                ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", bouquet.OccasionId);
                return View(bouquet);
            }
        }

        // 4. DELETE - Erase Bouquet Entity
        [HttpGet("delete/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
                if (bouquet != null)
                {
                    // Clear binary array images from system folder
                    if (!string.IsNullOrEmpty(bouquet.ImageUrl))
                    {
                        var paths = bouquet.ImageUrl.Split(',');
                        foreach (var path in paths)
                        {
                            string imgPath = Path.Combine(_webHostEnvironment.WebRootPath, path.TrimStart('/'));
                            if (System.IO.File.Exists(imgPath)) System.IO.File.Delete(imgPath);
                        }
                    }

                    _context.Bouquets.Remove(bouquet);
                    _context.SaveChanges();

                    TempData["AlertMessage"] = "Bouquet deleted successfully!";
                    TempData["AlertType"] = "success";
                }
                else
                {
                    TempData["AlertMessage"] = "The requested bouquet record could not be found.";
                    TempData["AlertType"] = "danger";
                }
            }
            catch (Exception)
            {
                TempData["AlertMessage"] = "Failed to complete deletion due to dependent data structural constraints.";
                TempData["AlertType"] = "danger";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
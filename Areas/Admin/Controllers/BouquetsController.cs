using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Shopv2.Data;
using Shopv2.Models;
using System;
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

        // 1. READ - Danh sách sản phẩm hoa
        [HttpGet("")]
        public IActionResult Index()
        {
            var bouquets = _context.Bouquets.ToList();
            ViewBag.Occasions = _context.Occasions.ToDictionary(o => o.Id, o => o.Name);
            return View(bouquets);
        }

        // 2. CREATE - Giao diện thêm
        [HttpGet("create")]
        public IActionResult Create()
        {
            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name");
            return View();
        }

        [HttpPost("create")]
        public IActionResult Create(Bouquet bouquet, List<IFormFile>? ImageFiles) // Đổi thành List<IFormFile>
        {
            bouquet.CreatedAt = DateTime.Now;

            // Kiểm tra xem danh sách file đẩy lên có phần tử nào không
            if (ImageFiles != null && ImageFiles.Count > 0)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                // Tạo một list để chứa các đường dẫn ảnh mới tạo ra
                var imagePaths = new List<string>();

                foreach (var file in ImageFiles)
                {
                    if (file.Length > 0)
                    {
                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            file.CopyTo(fileStream);
                        }

                        imagePaths.Add("/images/" + uniqueFileName);
                    }
                }

                // Gộp các đường dẫn lại thành 1 chuỗi, ngăn cách bằng dấu phẩy ',' để lưu vào DB
                // Ví dụ kết quả: "/images/img1.jpg,/images/img2.jpg"
                bouquet.ImageUrl = string.Join(",", imagePaths);
            }

            _context.Bouquets.Add(bouquet);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 3. UPDATE - Giao diện sửa
        [HttpGet("edit/{id}")]
        public IActionResult Edit(int id)
        {
            var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
            if (bouquet == null) return NotFound();

            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", bouquet.OccasionId);
            return View(bouquet);
        }

        [HttpPost("edit/{id}")]
        public IActionResult Edit(Bouquet bouquet, List<IFormFile>? ImageFiles) // Đổi thành List<IFormFile>
        {
            var existingBouquet = _context.Bouquets.FirstOrDefault(b => b.Id == bouquet.Id);
            if (existingBouquet == null) return NotFound();

            existingBouquet.Name = bouquet.Name;
            existingBouquet.Description = bouquet.Description;
            existingBouquet.Price = bouquet.Price;
            existingBouquet.OccasionId = bouquet.OccasionId;
            existingBouquet.IsActive = bouquet.IsActive;

            // Nếu người dùng chọn tải lên danh sách ảnh mới để thay thế
            if (ImageFiles != null && ImageFiles.Count > 0)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                // 1. XÓA TẤT CẢ ẢNH CŨ trên server để tránh rác bộ nhớ
                if (!string.IsNullOrEmpty(existingBouquet.ImageUrl))
                {
                    // Tách chuỗi ngược lại thành danh sách các file ảnh cũ
                    var oldPaths = existingBouquet.ImageUrl.Split(',');
                    foreach (var oldPath in oldPaths)
                    {
                        string fullOldPath = Path.Combine(_webHostEnvironment.WebRootPath, oldPath.TrimStart('/'));
                        if (System.IO.File.Exists(fullOldPath)) System.IO.File.Delete(fullOldPath);
                    }
                }

                // 2. LƯU LOẠT ẢNH MỚI
                var newImagePaths = new List<string>();
                foreach (var file in ImageFiles)
                {
                    if (file.Length > 0)
                    {
                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            file.CopyTo(fileStream);
                        }

                        newImagePaths.Add("/images/" + uniqueFileName);
                    }
                }

                // Cập nhật lại chuỗi ảnh mới vào database
                existingBouquet.ImageUrl = string.Join(",", newImagePaths);
            }

            _context.Bouquets.Update(existingBouquet);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 4. DELETE - Xóa hoa
        [HttpGet("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
            if (bouquet != null)
            {
                if (!string.IsNullOrEmpty(bouquet.ImageUrl))
                {
                    string imgPath = Path.Combine(_webHostEnvironment.WebRootPath, bouquet.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(imgPath)) System.IO.File.Delete(imgPath);
                }

                _context.Bouquets.Remove(bouquet);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
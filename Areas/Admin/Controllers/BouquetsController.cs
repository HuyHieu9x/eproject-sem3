using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Shopv2.Data;
using Shopv2.Models;
using System;
using System.IO;
using System.Linq;

namespace Shopv2.Controllers
{
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
        public IActionResult Index()
        {
            var bouquets = _context.Bouquets.ToList();
            ViewBag.Occasions = _context.Occasions.ToDictionary(o => o.Id, o => o.Name);
            return View(bouquets);
        }

        // 2. CREATE - Giao diện thêm
        public IActionResult Create()
        {
            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Bouquet bouquet)
        {
            // Tự tăng ID bằng code
            int maxId = _context.Bouquets.Any() ? _context.Bouquets.Max(b => b.Id) : 0;
            bouquet.Id = maxId + 1;
            bouquet.CreatedAt = DateTime.Now;

            // Xử lý Upload ảnh nếu có file
            if (bouquet.ImageFile != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + bouquet.ImageFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    bouquet.ImageFile.CopyTo(fileStream);
                }
                bouquet.ImageUrl = "/images/" + uniqueFileName;
            }

            _context.Bouquets.Add(bouquet);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 3. UPDATE - Giao diện sửa
        public IActionResult Edit(int id)
        {
            var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
            if (bouquet == null) return NotFound();

            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", bouquet.OccasionId);
            return View(bouquet);
        }

        [HttpPost]
        public IActionResult Edit(Bouquet bouquet)
        {
            // Lấy thực thể gốc từ DB để giữ lại ảnh cũ nếu người dùng không chọn ảnh mới
            var existingBouquet = _context.Bouquets.FirstOrDefault(b => b.Id == bouquet.Id);
            if (existingBouquet == null) return NotFound();

            existingBouquet.Name = bouquet.Name;
            existingBouquet.Description = bouquet.Description;
            existingBouquet.Price = bouquet.Price;
            existingBouquet.OccasionId = bouquet.OccasionId;
            existingBouquet.IsActive = bouquet.IsActive;

            // Nếu có upload ảnh mới
            if (bouquet.ImageUrl != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + bouquet.ImageUrl.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    bouquet.ImageUrl.CopyTo(fileStream);
                }

                // Xóa ảnh cũ trên server (nếu muốn dọn rác ổ đĩa)
                if (!string.IsNullOrEmpty(existingBouquet.ImageUrl))
                {
                    string oldPath = Path.Combine(_webHostEnvironment.WebRootPath, existingBouquet.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
                }

                existingBouquet.ImageUrl = "/images/" + uniqueFileName;
            }

            _context.Bouquets.Update(existingBouquet);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 4. DELETE - Xóa hoa
        public IActionResult Delete(int id)
        {
            var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
            if (bouquet != null)
            {
                // Xóa file ảnh vật lý trước khi xóa bản ghi dữ liệu
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
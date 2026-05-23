using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shopv2.Data;
using Shopv2.Models;
using System.Linq;

namespace Shopv2.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/occasions")]
    public class OccasionsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OccasionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("")]
        // 1. READ - Danh sách Occasions
        public IActionResult Index()
        {
            var data = _context.Occasions.ToList();
            return View(data);
        }

        [HttpGet("create")]
        // 2. CREATE - Giao diện Thêm mới
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost("create")]
        public IActionResult Create(Occasion occasion)
        {

            _context.Occasions.Add(occasion);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        [HttpGet("edit/{id}")]
        // 3. UPDATE - Giao diện Sửa
        public IActionResult Edit(int id)
        {
            var occasion = _context.Occasions.FirstOrDefault(o => o.Id == id);
            if (occasion == null) return NotFound();
            return View(occasion);
        }

        [HttpPost("edit/{id}")]
        public IActionResult Edit(int id, Occasion occasion)
        {
            _context.Occasions.Update(occasion);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        [HttpGet("delete/{id}")]
        // 4. DELETE - Xóa
        public IActionResult Delete(int id)
        {
            var occasion = _context.Occasions.FirstOrDefault(o => o.Id == id);
            if (occasion != null)
            {
                _context.Occasions.Remove(occasion);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
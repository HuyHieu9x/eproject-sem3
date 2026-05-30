using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Shopv2.Data;
using Shopv2.Models;
using System.Linq;

namespace Shopv2.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/messages")]
    public class MessagesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. READ - Danh sách Lời chúc (Có Tìm kiếm & Phân trang)
        [HttpGet("")]
        public IActionResult Index(string searchString, int page = 1)
        {
            int pageSize = 10; // Số lượng bản ghi trên mỗi trang (bạn có thể thay đổi)

            // Sử dụng IQueryable để hoãn thực thi (chưa ép kiểu về List vội)
            var query = _context.Messages.AsQueryable();

            // Tính năng Tìm kiếm: lọc theo Nội dung lời chúc (Content)
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(m => m.Content.Contains(searchString));
                // Lưu lại từ khóa tìm kiếm để hiển thị lại trên Form ở View
                ViewBag.CurrentFilter = searchString;
            }

            // Tính năng Phân trang: Tính toán số trang và bỏ qua (Skip) các bản ghi cũ
            int totalItems = query.Count();
            int totalPages = (int)System.Math.Ceiling((double)totalItems / pageSize);

            // Đảm bảo số trang hợp lệ
            if (page < 1) page = 1;
            if (page > totalPages && totalPages > 0) page = totalPages;

            var messages = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Truyền dữ liệu phân trang qua ViewBag
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            // Lấy danh sách dịp lễ nạp vào ViewBag như cũ
            ViewBag.Occasions = _context.Occasions.ToDictionary(o => o.Id, o => o.Name);

            return View(messages);
        }

        // 2. CREATE - Giao diện Thêm mới
        [HttpGet("create")]
        public IActionResult Create()
        {
            // Truyền danh sách dịp lễ sang Form để làm thẻ <select> dropdown
            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name");
            return View();
        }

        [HttpPost("create")]
        public IActionResult Create(Message message)
        {
            try
            {
                _context.Messages.Add(message);
                _context.SaveChanges();

                TempData["AlertMessage"] = "Message created successfully!";
                TempData["AlertType"] = "success";
                return RedirectToAction(nameof(Index));
            }
            catch (System.Exception)
            {
                TempData["AlertMessage"] = "Failed to create message due to a database exception.";
                TempData["AlertType"] = "danger";

                ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", message.OccasionId);
                return View(message);
            }
        }

        // 3. UPDATE - Giao diện Sửa
        [HttpGet("edit/{id}")]
        public IActionResult Edit(int id)
        {
            var message = _context.Messages.FirstOrDefault(m => m.Id == id);
            if (message == null) return NotFound();

            // Chọn sẵn Dịp lễ hiện tại của tin nhắn trong Dropdown
            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", message.OccasionId);
            return View(message);
        }

        [HttpPost("edit/{id}")]
        public IActionResult Edit(Message message)
        {
            try
            {
                _context.Messages.Update(message);
                _context.SaveChanges();

                TempData["AlertMessage"] = "Message updated successfully!";
                TempData["AlertType"] = "success";
                return RedirectToAction(nameof(Index));
            }
            catch (System.Exception)
            {
                TempData["AlertMessage"] = "Failed to update message. Please verify your fields.";
                TempData["AlertType"] = "danger";

                ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", message.OccasionId);
                return View(message);
            }
        }

        [HttpGet("delete/{id}")]
        // 4. DELETE - Remove message with validation alerts
        public IActionResult Delete(int id)
        {
            try
            {
                var message = _context.Messages.FirstOrDefault(m => m.Id == id);
                if (message != null)
                {
                    _context.Messages.Remove(message);
                    _context.SaveChanges();

                    TempData["AlertMessage"] = "Message deleted successfully!";
                    TempData["AlertType"] = "success";
                }
                else
                {
                    TempData["AlertMessage"] = "The requested message could not be found.";
                    TempData["AlertType"] = "danger";
                }
            }
            catch (System.Exception)
            {
                TempData["AlertMessage"] = "An error occurred while attempting to delete the message.";
                TempData["AlertType"] = "danger";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
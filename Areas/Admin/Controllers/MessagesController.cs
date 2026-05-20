using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Shopv2.Data;
using Shopv2.Models;
using System.Linq;

namespace Shopv2.Controllers
{
    public class MessagesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. READ - Danh sách Lời chúc
        public IActionResult Index()
        {
            var messages = _context.Messages.ToList();
            // Lấy danh sách dịp lễ nạp vào ViewBag để hiển thị Tên Dịp lễ thay vì hiển thị Id thô
            ViewBag.Occasions = _context.Occasions.ToDictionary(o => o.Id, o => o.Name);

            return View(messages);
        }

        // 2. CREATE - Giao diện Thêm mới
        public IActionResult Create()
        {
            // Truyền danh sách dịp lễ sang Form để làm thẻ <select> dropdown
            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Message message)
        {
            // Tự động tăng Id thủ công bằng code (do DB không cài identity)
            int maxId = _context.Messages.Any() ? _context.Messages.Max(m => m.Id) : 0;
            message.Id = maxId + 1;

            _context.Messages.Add(message);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 3. UPDATE - Giao diện Sửa
        public IActionResult Edit(int id)
        {
            var message = _context.Messages.FirstOrDefault(m => m.Id == id);
            if (message == null) return NotFound();

            // Chọn sẵn Dịp lễ hiện tại của tin nhắn trong Dropdown
            ViewBag.OccasionId = new SelectList(_context.Occasions, "Id", "Name", message.OccasionId);
            return View(message);
        }

        [HttpPost]
        public IActionResult Edit(Message message)
        {
            _context.Messages.Update(message);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // 4. DELETE - Xóa tin nhắn
        public IActionResult Delete(int id)
        {
            var message = _context.Messages.FirstOrDefault(m => m.Id == id);
            if (message != null)
            {
                _context.Messages.Remove(message);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
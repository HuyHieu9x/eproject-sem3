using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shopv2.Data;

namespace Shopv2.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            // Lấy Product cùng Category để View có thể truy cập item.Category.Name
            var products = await _context.Product
                .Include(p => p.Category)
                .ToListAsync();

            return View(products);
        }
    }
}

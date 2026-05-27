using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shopv2.Data;
using Shopv2.Models;
using Shopv2.Models.ViewModels;
using System.Linq;
using System.Threading.Tasks;

namespace Shopv2.Controllers
{
    public class ShopController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ShopController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int? occasionId, int page = 1, int pageSize = 2)
        {
            // Đảm bảo số trang tối thiểu là 1
            page = Math.Max(1, page);
            pageSize = Math.Max(1, pageSize);

            // 1. Khởi tạo truy vấn Bouquet hoạt động
            var bouquetsQuery = _context.Bouquets.Where(b => b.IsActive);

            // FIX BUG: Thêm logic lọc theo Occasion nếu có truyền vào
            if (occasionId.HasValue)
            {
                // Giả sử bảng Bouquet của bạn có trường OccasionId để liên kết
                bouquetsQuery = bouquetsQuery.Where(b => b.OccasionId == occasionId.Value);
            }

            // 2. Tính toán phân trang
            var totalBouquets = bouquetsQuery.Count();
            var totalPages = (int)Math.Ceiling(totalBouquets / (double)pageSize);

            // 3. Lấy danh sách sản phẩm theo trang
            var bouquets = bouquetsQuery
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // 4. Lấy danh sách danh mục (Occasions) cho Sidebar
            var occasions = _context.Occasions.OrderBy(o => o.Name).ToList();

            // 5. Đóng gói vào ViewModel
            var viewModel = new ShopIndexViewModel
            {
                Bouquets = bouquets,
                Occasions = occasions,
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = Math.Max(1, totalPages),
                SelectedOccasionId = occasionId
            };

            return View(viewModel);
        }
    }
}

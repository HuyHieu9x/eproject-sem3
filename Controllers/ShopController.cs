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

        public IActionResult Index(int? occasionId, int page = 1, int pageSize = 10)
        {
            page = Math.Max(1, page);
            pageSize = Math.Max(1, pageSize);

            var bouquetsQuery = _context.Bouquets.Where(b => b.IsActive);

            if (occasionId.HasValue)
            {
                bouquetsQuery = bouquetsQuery.Where(b => b.OccasionId == occasionId.Value);
            }

            var totalBouquets = bouquetsQuery.Count();
            var totalPages = (int)Math.Ceiling(totalBouquets / (double)pageSize);

            var bouquets = bouquetsQuery
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var occasions = _context.Occasions.OrderBy(o => o.Name).ToList();

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

        public IActionResult Detail(int id)
        {
            // 1. Lấy sản phẩm dựa theo Id
            var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
            if (bouquet == null) return NotFound();

            // 2. Lấy tên dịp lễ theo đúng logic của bạn
            var occasion = _context.Occasions.FirstOrDefault(o => o.Id == bouquet.OccasionId);
            ViewBag.OccasionName = occasion?.Name;

            // 3. XỬ LÝ CHUỖI IMAGEURL CHỨA NHIỀU ẢNH
            var allImages = new List<string>();
            string mainImage = "/images/default-bouquet.jpg"; // Ảnh sơ cua nếu sản phẩm không có ảnh

            if (!string.IsNullOrEmpty(bouquet.ImageUrl))
            {
                // Tách chuỗi ImageUrl dựa trên dấu phẩy thành List các đường dẫn ảnh thật
                allImages = bouquet.ImageUrl
                                   .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                   .Select(img => img.Trim())
                                   .ToList();

                // Lấy tấm ảnh đầu tiên trong chuỗi để làm ảnh hiển thị lớn mặc định ban đầu
                if (allImages.Any())
                {
                    mainImage = allImages.First();
                }
            }

            // Truyền dữ liệu sang View qua ViewBag
            ViewBag.MainImage = mainImage; // Đường dẫn 1 ảnh lớn
            ViewBag.AllImages = allImages; // Danh sách tất cả các ảnh để làm thumbnails

            return View(bouquet);
        }
    }
}

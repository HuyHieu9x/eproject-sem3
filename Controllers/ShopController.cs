using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shopv2.Data;
using Shopv2.Models;
using Shopv2.Models.ViewModels;
using System.Linq;
using System.Threading.Tasks;

namespace Shopv2.Controllers
{
    [Route("shop")]
    public class ShopController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ShopController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("")]
        public IActionResult Index(int? occasionId, int page = 1, int pageSize = 2)
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
                .Where(b => b.IsActive)
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
        [HttpGet("detail/{id}")]
        public IActionResult Detail(int id)
        {
            var bouquet = _context.Bouquets.FirstOrDefault(b => b.Id == id);
            if (bouquet == null) return NotFound();

            var occasion = _context.Occasions.FirstOrDefault(o => o.Id == bouquet.OccasionId);
            ViewBag.OccasionName = occasion?.Name;

            var allImages = new List<string>();
            string mainImage = "/images/default-bouquet.jpg";

            if (!string.IsNullOrEmpty(bouquet.ImageUrl))
            {
                allImages = bouquet.ImageUrl
                                   .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                   .Select(img => img.Trim())
                                   .ToList();

                if (allImages.Any())
                {
                    mainImage = allImages.First();
                }
            }

            ViewBag.MainImage = mainImage;
            ViewBag.AllImages = allImages;

            return View(bouquet);
        }
    }
}

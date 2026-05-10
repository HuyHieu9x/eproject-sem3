using Microsoft.AspNetCore.Mvc;

namespace Shopv2.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("admin/dashboard")]
    public class DashboardController : Controller
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            return View("index");
        }
    }
}

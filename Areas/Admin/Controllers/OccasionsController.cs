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
        // 1. READ - Occasions List (With Search & Pagination)
        public IActionResult Index(string searchString, int page = 1)
        {
            int pageSize = 10; // Number of records per page

            // Use IQueryable to defer execution and optimize SQL query performance
            var query = _context.Occasions.AsQueryable();

            // Search feature: filter by Occasion Name
            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(o => o.Name.Contains(searchString));
                ViewBag.CurrentFilter = searchString; // Retain the search keyword in the view input
            }

            // Pagination feature: calculate total pages
            int totalItems = query.Count();
            int totalPages = (int)System.Math.Ceiling((double)totalItems / pageSize);

            // Ensure current page is within valid boundaries
            if (page < 1) page = 1;
            if (page > totalPages && totalPages > 0) page = totalPages;

            // Fetch only the requested page records
            var data = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Pass pagination metadata to the View via ViewBag
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            return View(data);
        }

        [HttpGet("create")]
        // 2. CREATE - Add View
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost("create")]
        public IActionResult Create(Occasion occasion)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Occasions.Add(occasion);
                    _context.SaveChanges();

                    TempData["AlertMessage"] = "Occasion created successfully!";
                    TempData["AlertType"] = "success";
                    return RedirectToAction(nameof(Index));
                }
                TempData["AlertMessage"] = "Failed to create occasion. Please check your input.";
                TempData["AlertType"] = "danger";
            }
            catch (System.Exception)
            {
                TempData["AlertMessage"] = "An error occurred while saving data to the database.";
                TempData["AlertType"] = "danger";
            }
            return View(occasion);
        }

        [HttpGet("edit/{id}")]
        // 3. UPDATE - Edit View
        public IActionResult Edit(int id)
        {
            var occasion = _context.Occasions.FirstOrDefault(o => o.Id == id);
            if (occasion == null) return NotFound();
            return View(occasion);
        }

        [HttpPost("edit/{id}")]
        public IActionResult Edit(int id, Occasion occasion)
        {
            if (id != occasion.Id) return NotFound();

            try
            {
                if (ModelState.IsValid)
                {
                    _context.Occasions.Update(occasion);
                    _context.SaveChanges();

                    TempData["AlertMessage"] = "Occasion updated successfully!";
                    TempData["AlertType"] = "success";
                    return RedirectToAction(nameof(Index));
                }
                TempData["AlertMessage"] = "Failed to update occasion. Invalid data submitted.";
                TempData["AlertType"] = "danger";
            }
            catch (System.Exception)
            {
                TempData["AlertMessage"] = "An error occurred while modifying the data.";
                TempData["AlertType"] = "danger";
            }
            return View(occasion);
        }

        [HttpGet("delete/{id}")]
        // 4. DELETE - Remove record with validation alerts
        public IActionResult Delete(int id)
        {
            try
            {
                var occasion = _context.Occasions.FirstOrDefault(o => o.Id == id);
                if (occasion != null)
                {
                    _context.Occasions.Remove(occasion);
                    _context.SaveChanges();

                    TempData["AlertMessage"] = "Occasion deleted successfully!";
                    TempData["AlertType"] = "success";
                }
                else
                {
                    TempData["AlertMessage"] = "Occasion not found or already deleted.";
                    TempData["AlertType"] = "danger";
                }
            }
            catch (System.Exception)
            {
                // This handles cases where you cannot delete an occasion because it is linked to messages (Foreign Key constraint violation)
                TempData["AlertMessage"] = "Cannot delete this occasion because it is currently linked to existing messages.";
                TempData["AlertType"] = "danger";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
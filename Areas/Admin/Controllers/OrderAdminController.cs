using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shopv2.Data;
using Shopv2.Models;
using Shopv2.Models.ViewModels;
using System.Collections.Generic;
using System.Security.Claims;

namespace Shopv2.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/order")]
    public class OrderAdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        public OrderAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            List<Order> orders = _context.Orders.OrderBy(ord => ord.UserId).ThenBy(ord => ord.CreatedAt).ToList();
            return View(orders);
        }

        [HttpGet("detail/{id}")]
        public IActionResult Detail(int id)
        {
            //Select Order Infor
            Order order = _context.Orders.FirstOrDefault(ord => ord.Id == id);
            if (order == null)
            {
                return NotFound();
            }
            //Select Recipient Infor
            Recipient recipient = _context.Recipients.FirstOrDefault(data => data.OrderId == id);
            if (recipient == null)
            {
                recipient = new Recipient();
            }
            //Select Order Items List
            List<OrderItemViewModel> orderItems = (from ci in _context.OrderItems
                                                   join b in _context.Bouquets
                                                   on ci.BouquetId equals b.Id
                                                   where ci.OrderId == id
                                                   select new OrderItemViewModel
                                                   {
                                                       OrderItemId = ci.Id,
                                                       BouquetId = b.Id,
                                                       BouquetName = b.Name,
                                                       Description = b.Description,
                                                       ImageUrl = b.ImageUrl,
                                                       Price = ci.UnitPrice,
                                                       Quantity = ci.Quantity
                                                   }).ToList();

            OrderDetailViewModel orderDetail = new OrderDetailViewModel();
            orderDetail.Order = order;
            orderDetail.Recipient = recipient;
            orderDetail.OrderItems = orderItems;
            return View(orderDetail);
        }

        [HttpPost("edit/transport")]
        public IActionResult Transport(int orderId)
        {
            try
            {
                Order order = _context.Orders.FirstOrDefault(ord => ord.Id == orderId && ord.Status == "OB");    //OB: Order Booked
                if (order == null)
                {
                    TempData["FailMessage"] = "Fail to transport the order!";
                    return RedirectToAction("Index");
                }

                order.Status = "OT"; // OT: Order Transporting
                _context.Orders.Update(order);
                _context.SaveChanges();
            } catch (Exception e)
            {
                TempData["FailMessage"] = "Fail to transport the order!";
                return RedirectToAction("Index");
            }
            TempData["SuccessMessage"] = "Handover Order to Transport success!";
            return RedirectToAction("Index");
        }

        [HttpPost("edit/cancel")]
        public IActionResult Cancel(int orderId)
        {
            try
            {
                Order order = _context.Orders.FirstOrDefault(ord => ord.Id == orderId && (ord.Status == "OB" || ord.Status == "OC"));    //OB: Order Booked
                if (order == null)
                {
                    TempData["FailMessage"] = "Fail to cancel the order!";
                    return RedirectToAction("Index");
                }

                order.Status = "CO"; // CO: Cancel Order
                _context.Orders.Update(order);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                TempData["FailMessage"] = "Fail to cancel the order!";
                return RedirectToAction("Index");
            }
            TempData["SuccessMessage"] = "Cancel order success!";
            return RedirectToAction("Index");
        }
    }
}

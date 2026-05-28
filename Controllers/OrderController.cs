using MailKit.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shopv2.Data;
using Shopv2.Models;
using Shopv2.Models.ViewModels;
using System.Security.Claims;

namespace Shopv2.Controllers
{
    [Route("order")]
    [Authorize(Roles = "Client")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            int userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            List<Order> orders = _context.Orders.Where(ord => ord.UserId == userId).OrderByDescending(ord => ord.Status).ToList();
            return View(orders);
        }

        [HttpGet("detail/{id}")]
        public IActionResult Detail(int id)
        {
            int userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            //Select Order Infor
            Order order = _context.Orders.FirstOrDefault(ord => ord.Id == id && ord.UserId == userId);
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
            List<Occasion> occasions = _context.Occasions.ToList();
            List<Message> messages = _context.Messages.ToList();
            orderDetail.Order = order;
            orderDetail.Recipient = recipient;
            orderDetail.OrderItems = orderItems;
            orderDetail.Occasions = occasions;
            orderDetail.Messages = messages;
            return View(orderDetail);
        }

        [HttpPost("create")]
        public IActionResult create(int cartId)
        {
            Cart cart = _context.Carts.FirstOrDefault(x => x.Id == cartId);
            if (cart == null)
            {
                TempData["FailMessage"] = "Fail to order!";
                return RedirectToAction("", "cart");
            }
            

            int userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Create Order
            Order orderInsert = new Order();
            orderInsert.UserId = userId;
            decimal totalPrice = _context.CartItems.Where(itm => itm.CartId == cartId).Sum(itm => itm.UnitPrice * itm.Quantity);
            orderInsert.TotalAmount = totalPrice;
            orderInsert.Status = "OC";  //OC: Order Created
            orderInsert.PaymentMethod = "Credit Card";
            orderInsert.PaymentStatus = "N";
            _context.Orders.Add(orderInsert);
            _context.SaveChanges();
            // Create Order Items
            List<OrderItem> orderItemsInsert = new List<OrderItem>();
            if (orderInsert.Id <= 0)
            {
                TempData["FailMessage"] = "Fail to order!";
                return RedirectToAction("", "cart");
            }
            orderItemsInsert = (from ci in _context.CartItems
                                join b in _context.Bouquets
                                on ci.BouquetId equals b.Id
                                where ci.CartId == cart.Id
                                select new OrderItem
                                {
                                    OrderId = orderInsert.Id,
                                    BouquetId = b.Id,
                                    UnitPrice = ci.UnitPrice,
                                    Quantity = ci.Quantity
                                }).ToList();
            
            if (orderItemsInsert == null || orderItemsInsert.Count <= 0)
            {
                _context.Orders.Remove(orderInsert);
            }
            else
            {
                _context.OrderItems.AddRange(orderItemsInsert);
                _context.SaveChanges();
            }
            
            // Create Recipient Infor
            if (orderItemsInsert == null || orderItemsInsert.Count <= 0)
            {
                TempData["FailMessage"] = "Fail to order!";
                return RedirectToAction("", "cart");
            }

            // Delete Cart after Order Success
            List<CartItem> cartItems = _context.CartItems.Where(cItm => cItm.CartId == cart.Id).ToList();
            //_context.CartItems.RemoveRange(cartItems);
            _context.SaveChanges();
            return RedirectToAction("detail", "order", new { id = orderInsert.Id });
        }

        [HttpPost("edit/paid")]
        public IActionResult Payment(int orderId)
        {
            int userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            Order order = _context.Orders.FirstOrDefault(ord => ord.Id == orderId && ord.UserId == userId && ord.Status == "OC");    //OC: Order Created
            if (order == null)
            {
                return View("Error");
            }
            order.PaymentStatus = "Y";
            _context.Orders.Update(order);
            _context.SaveChanges();
            return RedirectToAction("detail", "order", new { id = orderId });
        }

        [HttpPost("edit/book")]
        public IActionResult BookOrder([Bind(Prefix = "RecipientModel")] RecipientCreateModel model)
        {
            int userId = int.Parse(HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            Order order = _context.Orders.FirstOrDefault(ord => ord.Id == model.OrderId && ord.UserId == userId && ord.Status == "OC" && ord.PaymentStatus == "Y");    //OC: Order Created
            if (order == null)
            {
                TempData["FailMessage"] = "Fail to process booking!";
                return RedirectToAction("detail", "order", new { id = model.OrderId });
            }
            // Create Recipient
            Recipient recipientCreate = new Recipient();
            recipientCreate.OrderId = order.Id;
            recipientCreate.Name = model.RecipientName;
            recipientCreate.Address = model.RecipientAddress;
            recipientCreate.Phone = model.RecipientPhone;
            recipientCreate.Message = model.RecipientMessage;
            _context.Recipients.Add(recipientCreate);
            _context.SaveChanges();
            if (recipientCreate.Id <= 0)
            {
                TempData["FailMessage"] = "Fail to process booking!";
                return RedirectToAction("detail", "order", new { id = model.OrderId });
            }
            // Update Order Status
            var now = DateTime.Now;
            int manualSeconds = (now.Hour * 3600) + (now.Minute * 60) + now.Second;
            int nineAmSecs = 9 * 3600;
            int deliveryEndTimeSecs = 17 * 3600;
            // Set Delivery Time
            DateTime deliveryDt;
            if (manualSeconds < nineAmSecs)
            {
                deliveryDt = DateTime.Today.AddHours(9 + 5);  // 5 hour after start working time
            }
            else if (manualSeconds >= nineAmSecs && manualSeconds <= deliveryEndTimeSecs)
            {
                deliveryDt = now.AddHours(5);   // 5 hours from current
            }
            else
            {
                deliveryDt = DateTime.Today.AddDays(1).AddHours(9+5); // 5 hour after start working time tommorow
            }
            order.Status = "OB"; // OB: Order Booked
            order.DeliveryDate = deliveryDt;
            _context.Orders.Update(order);

            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shopv2.Data;
using Shopv2.Models;
using Shopv2.Models.ViewModels;
using System;
using System.Security.Claims;

namespace Shopv2.Controllers
{
    [Route("cart")]
    public class CartController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-to-cart")]
        public IActionResult AddToCart(int bouquetId, int quantity = 1)
        {
            // lấy user login
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Redirect("/login");
            }

            int userId = int.Parse(userIdClaim);

            // tìm cart của user
            var cart = _context.Carts
                .FirstOrDefault(x => x.UserId == userId);

            // chưa có cart => tạo mới
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.Now
                };

                _context.Carts.Add(cart);
                _context.SaveChanges();
            }

            // lấy bouquet
            var bouquet = _context.Bouquets
                .FirstOrDefault(x => x.Id == bouquetId);

            if (bouquet == null)
            {
                return NotFound();
            }

            // kiểm tra item tồn tại chưa
            var cartItem = _context.CartItems
                .FirstOrDefault(x =>
                    x.CartId == cart.Id &&
                    x.BouquetId == bouquetId);

            if (cartItem != null)
            {
                // đã có => tăng quantity
                cartItem.Quantity += quantity;
            }
            else
            {
                // chưa có => insert mới
                cartItem = new CartItem
                {
                    CartId = cart.Id,
                    BouquetId = bouquetId,
                    Quantity = quantity,
                    UnitPrice = bouquet.Price
                };

                _context.CartItems.Add(cartItem);
            }

            _context.SaveChanges();

            return RedirectToAction("Index", "Cart");
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            // TEMP
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Redirect("/login");
            }
            int userId = int.Parse(userIdClaim);

            var cart = _context.Carts
                .FirstOrDefault(x => x.UserId == userId);

            CartViewModel cartViewModel = new CartViewModel();
            cartViewModel.cartId = -1;
            cartViewModel.cartItemsView = new List<CartItemViewModel>();
            if (cart == null)
            {
                return View(cartViewModel);
            }

            var cartItems = (from ci in _context.CartItems
                             join b in _context.Bouquets
                             on ci.BouquetId equals b.Id
                             where ci.CartId == cart.Id
                             select new CartItemViewModel
                             {
                                 CartItemId = ci.Id,
                                 BouquetId = b.Id,
                                 BouquetName = b.Name,
                                 Description = b.Description,
                                 ImageUrl = b.ImageUrl,
                                 Price = ci.UnitPrice,
                                 Quantity = ci.Quantity
                             }).ToList();

            
            cartViewModel.cartId = cart.Id;
            cartViewModel.cartItemsView = cartItems;

            return View(cartViewModel);
        }

        [HttpPost("increase")]
        public IActionResult IncreaseQuantity(int cartItemId)
        {
            var cartItem = _context.CartItems
                .FirstOrDefault(x => x.Id == cartItemId);

            if (cartItem != null)
            {
                cartItem.Quantity += 1;
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        [HttpPost("decrease")]
        public IActionResult DecreaseQuantity(int cartItemId)
        {
            var cartItem = _context.CartItems
                .FirstOrDefault(x => x.Id == cartItemId);

            if (cartItem != null)
            {
                cartItem.Quantity -= 1;

                if (cartItem.Quantity <= 0)
                {
                    _context.CartItems.Remove(cartItem);
                }

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        [HttpPost("remove")]
        public IActionResult Remove(int cartItemId)
        {
            var cartItem = _context.CartItems
                .FirstOrDefault(x => x.Id == cartItemId);

            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
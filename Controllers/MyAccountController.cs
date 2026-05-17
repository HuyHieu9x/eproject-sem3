using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using Shopv2.Data;
using Shopv2.Models;
using Shopv2.Models.ViewModels;
using Shopv2.Services;
using System.Security.Claims;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Identity;

namespace Shopv2.Controllers
{
    [Route("my-account")]
    public class MyAccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordService _passwordService;

        public MyAccountController(ApplicationDbContext context, PasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        [HttpGet("")]
        public IActionResult Index()
        {

            return View("index");
        }

        [HttpGet("register")]
        public IActionResult register()
        {

            return View("register");
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var checkUser = _context.Users
                .FirstOrDefault(x => x.Email == model.Username);

            if (checkUser != null)
            {
                ModelState.AddModelError("", "Email already exists");
                return View(model);
            }

            var user = new User();

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Username;
            user.Phone = model.Phone;
            user.Address = model.Address;
            user.Dob = model.Dob;
            user.Gender = model.Gender;
            user.Role = "Client";

            var passwordHasher = new PasswordHasher<User>();

            user.PasswordHash = passwordHasher.HashPassword(user, model.Password);

            _context.Users.Add(user);
            _context.SaveChanges();

            TempData["success"] = "Register success";

            return Redirect("/my-account");
        }

        [HttpPost("")]
        public async Task<IActionResult> Index(AdminLoginViewModel model)
        {
            Console.WriteLine("Vao day");
            if (!ModelState.IsValid)
                return View(model);

            var user = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Email == model.Email &&
                    x.Role == "Client");

            if (user == null)
            {
                ModelState.AddModelError("", "Tài khoản hoặc mật khẩu không đúng");
                return View(model);
            }

            var passwordMatched = _passwordService.VerifyPassword(
                                    user,
                                    user.PasswordHash,
                                    model.Password);

            if (!passwordMatched)
            {
                ModelState.AddModelError("", "Invalid credentials");
                return View(model);
            }

            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                };

            var identity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme);

            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal);

            Console.WriteLine("Login Success");
            return Redirect("/");
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            return Redirect("/my-account");
        }

        [HttpGet("forget-password")]
        public IActionResult ForgetPassword()
        {
            return View("ForgetPassword");
        }

        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = _context.Users
                .FirstOrDefault(x => x.Email == model.Email &&
                    x.Role == "Client");

            if (user == null)
            {
                ModelState.AddModelError(
                    "",
                    "Email has not been registered"
                );

                return View(model);
            }

            string newPassword = Guid.NewGuid().ToString().Substring(0, 8);

            var passwordHasher = new PasswordHasher<User>();

            user.PasswordHash = passwordHasher.HashPassword(
                user,
                newPassword
            );

            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(
                "FlowersShop",
                "chonkhongtien98@gmail.com"
            ));

            email.To.Add(
                MailboxAddress.Parse(model.Email)
            );

            email.Subject = "Reset Password";

            email.Body = new TextPart("plain")
            {
                Text =
                $"Your new password is: {newPassword}"
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                "smtp.gmail.com",
                587,
                MailKit.Security.SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                "chonkhongtien98@gmail.com",
                "idrr asrl lskk rcnf"
            );

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);

            TempData["success"] =
                "New password has been sent to your email";

            return Redirect("/my-account");
        }
    }
}
    
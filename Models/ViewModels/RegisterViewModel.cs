using System.ComponentModel.DataAnnotations;

namespace Shopv2.Models.ViewModels
{
    public class RegisterViewModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password minimum 6 characters")]
        public string Password { get; set; }

        public DateTime? Dob { get; set; }
        public int? Gender { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}

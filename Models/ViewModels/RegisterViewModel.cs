using System.ComponentModel.DataAnnotations;

namespace Shopv2.Models.ViewModels
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password minimum 6 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Date of Birth is required")]
        public DateTime? Dob { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        public int? Gender { get; set; }

        [Required(ErrorMessage = "Phone is required")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; }
    }
}

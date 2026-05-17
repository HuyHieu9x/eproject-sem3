using System.ComponentModel.DataAnnotations;

namespace Shopv2.Models.ViewModels
{
    public class AdminLoginViewModel
    {
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; }
    }
}

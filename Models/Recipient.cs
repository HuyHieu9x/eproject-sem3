using System.ComponentModel.DataAnnotations;

namespace Shopv2.Models
{
    public class Recipient
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Message { get; set; }

        public Order Order { get; set; } = null!;
    }
}

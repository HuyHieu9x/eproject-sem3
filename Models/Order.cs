using System.ComponentModel.DataAnnotations.Schema;

namespace Shopv2.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "Pending";

        public string PaymentMethod { get; set; } = "CreditCard";

        public string PaymentStatus { get; set; } = "Pending";

        public DateTime? DeliveryDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

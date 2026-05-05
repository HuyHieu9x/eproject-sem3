using System.ComponentModel.DataAnnotations.Schema;

namespace Shopv2.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int BouquetId { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        public Order Order { get; set; } = null!;

        public Bouquet Bouquet { get; set; } = null!;
    }
}

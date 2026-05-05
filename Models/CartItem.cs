using System.ComponentModel.DataAnnotations.Schema;

namespace Shopv2.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartId { get; set; }

        public int BouquetId { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        public Cart Cart { get; set; } = null!;

        public Bouquet Bouquet { get; set; } = null!;
    }
}

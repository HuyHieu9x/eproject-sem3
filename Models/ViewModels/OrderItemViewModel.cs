namespace Shopv2.Models.ViewModels
{
    public class OrderItemViewModel
    {
        public int OrderItemId { get; set; }

        public int BouquetId { get; set; }

        public string BouquetName { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public decimal TotalPrice => Price * Quantity;
    }
}

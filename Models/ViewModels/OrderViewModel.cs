namespace Shopv2.Models.ViewModels
{
    public class OrderViewModel
    {
        public List<Order> orders { get; set; } = new();
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}

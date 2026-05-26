namespace Shopv2.Models.ViewModels
{
    public class ShopIndexViewModel
    {
        public List<Bouquet> Bouquets { get; set; } = new();
        public List<Occasion> Occasions { get; set; } = new();
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int? SelectedOccasionId { get; set; }
    }
}

namespace Shopv2.Models.ViewModels
{
    public class CartViewModel
    {
        public int cartId { get; set; }
        public List<CartItemViewModel> cartItemsView { get; set; }
    }
}

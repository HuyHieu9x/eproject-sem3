namespace Shopv2.Models.ViewModels
{
    public class OrderDetailViewModel
    {
        public Order Order { get; set; }
        public Recipient Recipient { get; set; }

        public List<OrderItemViewModel> OrderItems { get; set; }

        public List<Occasion> Occasions { get; set; }

        public List<Message> Messages { get; set; }

        public RecipientCreateModel RecipientModel { get; set; }

    }
}

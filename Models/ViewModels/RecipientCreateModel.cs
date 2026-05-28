namespace Shopv2.Models.ViewModels
{
    public class RecipientCreateModel
    {
        

        public int OrderId { get; set; }

        public string RecipientName { get; set; }

        public string RecipientAddress { get; set; }

        public string RecipientPhone { get; set; }

        public string RecipientMessage { get; set; }

        public decimal TotalPrice { get; set; }

    }
}

using System.ComponentModel.DataAnnotations;

namespace Shopv2.Models
{
    public class Message
    {
        public int Id { get; set; }

        public int OccasionId { get; set; }

        [Required, MaxLength(500)]
        public string Content { get; set; } = string.Empty;

        public Occasion Occasion { get; set; } = null!;
    }
}

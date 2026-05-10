using System.ComponentModel.DataAnnotations;

namespace Shopv2.Models
{
    public class Occasion
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}

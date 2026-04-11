using System.ComponentModel.DataAnnotations;

namespace Shopv2.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public int Status { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}

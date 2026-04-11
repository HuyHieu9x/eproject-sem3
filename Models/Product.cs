using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shopv2.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public int Price { get; set; }

        public int Status { get; set; }

        public DateTime CreatedDate { get; set; }

        public int CategoryId { get; set; }

        public Category Category { get; set; }
    }
}

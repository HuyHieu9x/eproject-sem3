using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shopv2.Models
{
    public class Bouquet
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // Cột này để lưu đường dẫn ảnh vào Database (ví dụ: "/images/abc.jpg")
        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        // THÊM THUỘC TÍNH NÀY: Để hứng file từ thẻ <input type="file"> ở View
        [NotMapped]
        List<IFormFile>? ImageFiles { get; set; }

        public int OccasionId { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

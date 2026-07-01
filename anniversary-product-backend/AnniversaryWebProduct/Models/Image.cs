using System.ComponentModel.DataAnnotations;

namespace AnniversaryWebProduct.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public string Title { get; set; } = "Image";
        [Required]
        public string FileDetails { get; set; }
        public virtual MemoryItem MemoryItem { get; set; }

    }
}

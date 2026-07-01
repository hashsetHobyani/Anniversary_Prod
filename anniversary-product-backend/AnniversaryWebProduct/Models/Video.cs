using System.ComponentModel.DataAnnotations;

namespace AnniversaryWebProduct.Models
{
    public class Video
    {
        [Key]
        public int VideoId { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public string Title { get; set; } = "Video";
        [Required]
        public string FileDetails { get; set; }
        [Required]
        public decimal DurationInSeconds { get; set; } = 10;
        public virtual MemoryItem MemoryItem { get; set; }
    }
}

using AnniversaryWebProduct.ViewModels;
using System.ComponentModel.DataAnnotations;

namespace AnniversaryWebProduct.Models
{
    public class Chat
    {
        [Key]
        public int ChatId { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public AuthorEnum Author { get; set; }
        [Required]
        public string MessageDescription { get; set; } = "";
        [Required]
        public MessageFormatEnum MessageType { get; set; }
        public virtual Call? Call { get; set; }
        public virtual MemoryItem MemoryItem { get; set; }

    }
}

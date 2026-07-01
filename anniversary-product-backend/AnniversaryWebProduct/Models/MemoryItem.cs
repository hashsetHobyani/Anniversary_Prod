using AnniversaryWebProduct.ViewModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnniversaryWebProduct.Models
{
    public class MemoryItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public MemoryTypeEnum Type { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        public int? VideoId { get; set; }
        public int? ImageId { get; set; }
        public int? ChatId { get; set; }

        public virtual Video Video { get; set; }
        public virtual Image Image { get; set; }
        public virtual Chat Chat { get; set; }

        [Required]
        public int HistoryInstanceId { get; set; }

        [ForeignKey(nameof(HistoryInstanceId))]
        public virtual HistoryInstance HistoryInstance { get; set; }


    }
}

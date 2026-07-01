using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnniversaryWebProduct.Models
{
    public class HistoryInstance
    {
        [Key]
        public int HistoryInstanceId { get; set; }

        [Required]
        public DateOnly HistoryDate { get; set; }   // instance that will be used a search point for all data

        public virtual ICollection<MemoryItem> MemoryItems { get; set; }
    }
}

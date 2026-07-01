using AnniversaryWebProduct.ViewModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnniversaryWebProduct.Models
{
    public class Call
    {
        //contains summary stats that take long compute time, rather save beforhand
        [Key]
        public int CallId { get; set; }
        [Required]
        public CallStateEnum CallState { get; set; }
        public decimal Duration { get; set; } = 0;
        [Required]
        public int ChatId { get; set; }
        [ForeignKey(nameof(ChatId))]
        public virtual Chat Chat { get; set; }

    }
}

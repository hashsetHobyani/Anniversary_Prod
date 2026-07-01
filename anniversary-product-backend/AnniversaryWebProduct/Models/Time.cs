using System.ComponentModel.DataAnnotations;

namespace AnniversaryWebProduct.Models
{
    public class Time
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string TimerName { get; set; }
        [Required]
        public DateTime DateStart { get; set; }
        [Required]
        public DateTime DateEnd { get; set; }
        [Required]
        public bool IsActive { get; set; }  = true;
    }
}

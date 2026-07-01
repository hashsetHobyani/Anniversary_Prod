namespace AnniversaryWebProduct.ViewModels
{
    public class TimerDto
    {
        public int Id { get; set; } = 1;
        public string ? TimerName { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

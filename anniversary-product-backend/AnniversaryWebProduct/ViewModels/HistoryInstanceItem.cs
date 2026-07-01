namespace AnniversaryWebProduct.ViewModels
{
    public class HistoryInstanceItemDto
    {
        public List<ChatItemDto> ChatItems { get; set; } = new List<ChatItemDto>();
        public List<VideoItemDto> VideoItems { get; set; } = new List<VideoItemDto>();
        public List<ImageItemDto> ImageItems { get; set; } = new List<ImageItemDto>();
        public DateOnly Date { get; set; }
    }
    public class ChatItemDto
    {
        public int ChatId { get; set; }
        public DateTime CreatedAt { get; set; }
        public AuthorEnum Author { get; set; }
        public string MessageDescription { get; set; } = "";
        public MessageFormatEnum MessageType { get; set; }
    }
    public class VideoItemDto
    {
        public int VideoId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Title { get; set; } = "Video";
        public string FileDetails { get; set; }
    }
    public class ImageItemDto
    {
        public int ImageId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Title { get; set; } = "Image";
        public string FileDetails { get; set; }
    }
    public class CalendarEventDto
    {
        public DateOnly Date { get; set; }
        public bool HasChats { get; set; }
        public bool HasImages { get; set; }
        public bool HasVideos { get; set; }
        public int ChatCount { get; set; }
        public int ImageCount { get; set; }
        public int VideoCount { get; set; }
    }
}

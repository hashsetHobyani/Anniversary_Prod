namespace AnniversaryWebProduct.ViewModels
{
    public class MessageStatsDto
    {
        public ChatStatsDto ChatStats { get; set; } = new();
        public ImageStatsDto ImageStats { get; set; } = new();
        public VideoStatsDto VideoStats { get; set; } = new();
        public CallStatsDto CallStats { get; set; } = new();
        public int TotalMemoryDays { get; set; }
        public DateOnly? FirstMemoryDate { get; set; }
        public DateOnly? LastMemoryDate { get; set; }
        public int LongestStreak { get; set; }
    }

    public abstract class SummaryStatsDto
    {
        public int Count { get; set; }
    }

    public class VideoStatsDto : SummaryStatsDto
    {
        public int TotalMinutes { get; set; }

        public decimal TotalHours { get; set; }
    }

    public class ImageStatsDto : SummaryStatsDto
    {
    }

    public class ChatStatsDto : SummaryStatsDto
    {
        public int TotalWords { get; set; }
        public int TotalCharacters { get; set; }
        public int PageCount { get; set; }
        public int AverageMessagesPerDay { get; set; }
        public int BusiestDayMessageCount { get; set; }
    }
    public class CallStatsDto : SummaryStatsDto
    {
        public int TotalMinutes { get; set; } 
        public decimal TotalHours { get; set; }
        public int TotalDays { get; set; } //equivalent in days,
        public decimal LongestCall {  get; set; }
        public decimal AverageCallLength { get; set; }
        public int VideoCalls {  get; set; }
        public int VoiceCalls {  get; set; }

        public int MissedCalls { get; set; }

        public int AnsweredCalls { get; set; }

    }
}

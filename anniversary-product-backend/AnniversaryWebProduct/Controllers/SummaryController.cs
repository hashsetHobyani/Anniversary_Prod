using AnniversaryWebProduct.Models;
using AnniversaryWebProduct.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AnniversaryWebProduct.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SummaryController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public SummaryController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("SummaryStats")]
        public async Task<ActionResult<MessageStatsDto>> GetMemorySummary()
        {
            if (!await _dbContext.MemoryItem.AnyAsync())
            {
                return NotFound(new
                {
                    message = "Unable to generate summary stats from empty memories"
                });
            }

            // 🔹 Load chats with date grouping info
            var chatData = await _dbContext.Chats
                .AsNoTracking()
                .Select(c => new
                {
                    c.MessageDescription,
                    c.CreatedAt,
                    Date = c.CreatedAt.Date
                })
                .ToListAsync();

            var videoData = await _dbContext.Videos
                .AsNoTracking()
                .ToListAsync();

            var imageCount = await _dbContext.Images.CountAsync();

            var historyDates = await _dbContext.HistoryInstance
                .AsNoTracking()
                .Select(h => h.HistoryDate)
                .OrderBy(d => d)
                .ToListAsync();
            var callData = await _dbContext.Call
                .AsNoTracking()
                .Include(c => c.Chat)
                .ToListAsync();

            // =========================
            // 💬 CHAT STATS
            // =========================

            int totalMessages = chatData.Count;

            int totalCharacters = chatData.Sum(c => c.MessageDescription?.Length ?? 0);

            int totalWords = chatData.Sum(c =>
                c.MessageDescription?
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .Length ?? 0);

            int pageCount = (int)Math.Ceiling(totalWords / 250.0);

            // 🔥 GROUP BY DAY (core logic)
            var messagesPerDay = chatData
                .GroupBy(c => c.Date)
                .Select(g => g.Count())
                .ToList();

            int busiestDay = messagesPerDay.Any() ? messagesPerDay.Max() : 0;

            int averagePerDay = historyDates.Any()
                ? (int)Math.Round((double)totalMessages / historyDates.Count)
                : 0;

            // =========================
            // 🎥 VIDEO STATS
            // =========================

            decimal totalSeconds = videoData.Sum(v => v.DurationInSeconds);

            int totalMinutes = (int)(totalSeconds / 60);

            decimal totalHours = Math.Round(totalSeconds / 3600m, 1);
            
            
            // =========================
            // 📞 CALL STATS
            // =========================

            int totalCalls = callData.Count;

            decimal totalCallMinutes = callData.Sum(c => c.Duration);

            decimal totalCallHours = Math.Round(totalCallMinutes / 60m, 1);

            decimal longestCall = callData.Any()
                ? callData.Max(c => c.Duration)
                : 0;

            int videoCalls = callData.Count(c =>
                c.Chat.MessageType == MessageFormatEnum.VideoCall);

            int voiceCalls = callData.Count(c =>
                c.Chat.MessageType == MessageFormatEnum.VoiceCall);

            int missedCalls = callData.Count(c =>
                c.CallState == CallStateEnum.Missed);

            int answeredCalls = totalCalls - missedCalls;

            int totalCallDays = callData
                .Select(c => DateOnly.FromDateTime(c.Chat.CreatedAt))
                .Distinct()
                .Count();

            decimal averageCallLength = totalCalls == 0
                ? 0
                : Math.Round(totalCallMinutes / totalCalls, 1);
            // =========================
            //FINAL RESPONSE
            // =========================

            var result = new MessageStatsDto
            {
                ChatStats = new ChatStatsDto
                {
                    Count = totalMessages,
                    TotalCharacters = totalCharacters,
                    TotalWords = totalWords,
                    PageCount = pageCount,

                    AverageMessagesPerDay = averagePerDay,
                    BusiestDayMessageCount = busiestDay
                },

                ImageStats = new ImageStatsDto
                {
                    Count = imageCount
                },

                VideoStats = new VideoStatsDto
                {
                    Count = videoData.Count,
                    TotalMinutes = totalMinutes,
                    TotalHours = totalHours
                },
                CallStats = new CallStatsDto
                {
                    Count = totalCalls,

                    TotalMinutes = (int)totalCallMinutes,

                    TotalHours = (int)totalCallHours,

                    TotalDays = totalCallDays,

                    LongestCall = longestCall,

                    VideoCalls = videoCalls,

                    VoiceCalls = voiceCalls,

                    MissedCalls = missedCalls,

                    AnsweredCalls = answeredCalls,

                    AverageCallLength = averageCallLength
                },

                TotalMemoryDays = historyDates.Count, //how many days spent talking to each other
                FirstMemoryDate = historyDates.FirstOrDefault(),
                LastMemoryDate = historyDates.LastOrDefault(),
                LongestStreak = CalculateLongestStreak(historyDates)
            };

            return Ok(result);
        }
        private static int CalculateLongestStreak(List<DateOnly> dates)
        {
            if (!dates.Any())
                return 0;

            dates = dates.Distinct()
                         .OrderBy(d => d)
                         .ToList();

            int current = 1;
            int longest = 1;

            for (int i = 1; i < dates.Count; i++)
            {
                if (dates[i].DayNumber - dates[i - 1].DayNumber == 1)
                {
                    current++;
                }
                else
                {
                    longest = Math.Max(longest, current);
                    current = 1;
                }
            }

            return Math.Max(longest, current);
        }
    }

}

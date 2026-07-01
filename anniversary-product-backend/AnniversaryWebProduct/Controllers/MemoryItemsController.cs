using AnniversaryWebProduct.Factory;
using AnniversaryWebProduct.Models;
using AnniversaryWebProduct.ViewModels;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AnniversaryWebProduct.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemoryItemsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IHistoryData _historyData ;

        public MemoryItemsController(AppDbContext context,IHistoryData historyData)
        {
            _dbContext = context;
            _historyData = historyData;
        }
        [HttpGet("day")]
        public async Task<ActionResult<HistoryInstanceItemDto>> GetHistoryInstance(
                    [FromQuery] DateOnly date)
        {
            var history = await _dbContext.HistoryInstance
                .Include(h => h.MemoryItems)
                    .ThenInclude(m => m.Chat)
                .Include(h => h.MemoryItems)
                    .ThenInclude(m => m.Image)
                .Include(h => h.MemoryItems)
                    .ThenInclude(m => m.Video)
                .FirstOrDefaultAsync(h => h.HistoryDate == date);
            var vids = await _dbContext.HistoryInstance.Include(h => h.MemoryItems).ThenInclude(k => k.Image).FirstOrDefaultAsync(h => h.HistoryDate == date);
            if (history == null)
                return NotFound();

            var dto = new HistoryInstanceItemDto
            {
                Date = history.HistoryDate,

                ChatItems = history.MemoryItems
                    .Where(m => m.ChatId != null)
                    .Select(m => new ChatItemDto
                    {
                        ChatId = m.Chat.ChatId,
                        CreatedAt = m.Chat.CreatedAt,
                        Author = m.Chat.Author,
                        MessageDescription = m.Chat.MessageDescription,
                        MessageType = m.Chat.MessageType
                    })
                    .OrderBy(c => c.CreatedAt)
                    .ToList(),

                ImageItems = history.MemoryItems
                    .Where(m => m.ImageId != null)
                    .Select(m => new ImageItemDto
                    {
                        ImageId = m.Image.ImageId,
                        CreatedAt = m.Image.CreatedAt,
                        Title = m.Image.Title,
                        FileDetails = m.Image.FileDetails
                    })
                    .OrderBy(i => i.CreatedAt)
                    .ToList(),

                VideoItems = history.MemoryItems
                    .Where(m => m.VideoId != null)
                    .Select(m => new VideoItemDto
                    {
                        VideoId = m.Video.VideoId,
                        CreatedAt = m.Video.CreatedAt,
                        Title = m.Video.Title,
                        FileDetails = m.Video.FileDetails
                    })
                    .OrderBy(v => v.CreatedAt)
                    .ToList()
            };
            return Ok(dto);
        }

        [HttpGet("calendar")]
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetCalendar(
            [FromQuery] int year,
            [FromQuery] int month)
        {
            var result = await _dbContext.HistoryInstance
                .Where(h =>
                    h.HistoryDate.Year == year &&
                    h.HistoryDate.Month == month)
                .Select(h => new CalendarEventDto
                {
                    Date = h.HistoryDate,

                    ChatCount = h.MemoryItems.Count(m => m.ChatId != null),
                    ImageCount = h.MemoryItems.Count(m => m.ImageId != null),
                    VideoCount = h.MemoryItems.Count(m => m.VideoId != null),

                    HasChats = h.MemoryItems.Any(m => m.ChatId != null),
                    HasImages = h.MemoryItems.Any(m => m.ImageId != null),
                    HasVideos = h.MemoryItems.Any(m => m.VideoId != null)
                })
                .ToListAsync();

            return Ok(result);
        }

    }
}

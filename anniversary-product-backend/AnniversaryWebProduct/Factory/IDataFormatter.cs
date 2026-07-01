using AnniversaryWebProduct.Models;
using AnniversaryWebProduct.ViewModels;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.EntityFrameworkCore;

namespace AnniversaryWebProduct.Factory
{
    public interface IDataFormatter
    {
        Task<List<ActiveFileDto>> GetFilesUsed();
        Task<ImportResultDto> ImportChatHistory(FileImportDto chat);
        Task<ImportResultDto> ImportVideoHistory(FileImportDto chat);
        Task<ImportResultDto> ImportImageHistory (FileImportDto chat);
        Task<ImportResultDto> ImportMediaHistory(FileImportDto chat);
        Task ClearImportData(FileTypeEnum file,int ? id);
        Task ClearImportData(FileTypeEnum clearImport);
    }
    public class DataFormatter : IDataFormatter
    {
        private readonly AppDbContext _dbContext;
        private readonly IFormatService _formatService;
        public DataFormatter(AppDbContext dbContext, IFormatService formatService)
        {
            _dbContext = dbContext;
            _formatService = formatService;
        }
        public async Task<List<ActiveFileDto>> GetFilesUsed()
        {
            var chat = await _dbContext.Chats.ToListAsync();
            var images = await _dbContext.Images.ToListAsync();
            var video = await _dbContext.Videos.ToListAsync();

            var activeFiles = new List<ActiveFileDto>();

            if(chat.Any())
                activeFiles.Add(new ActiveFileDto {Name = "chats.txt", CountFiles = chat.Count });
            if (images.Any())
                activeFiles.Add(new ActiveFileDto { Name = "Images", CountFiles = images.Count });
            if (video.Any())
                activeFiles.Add(new ActiveFileDto { Name = "Videos", CountFiles = video.Count });

            return activeFiles;

        }
        public async Task<ImportResultDto> ImportChatHistory(FileImportDto chat)
        {
            var file = chat.formFile?.FirstOrDefault();

            if (file == null)
                throw new ArgumentNullException(nameof(file));

            var result = chat.ChatType switch
            {
                ChatFileFormatEnum.txt =>
                    await _formatService.TXTExtractTextAsync(file),

                //ChatFileFormatEnum.pdf =>
                //    //await _formatService.PDFExtractTextAsync(file),

                //// to add docx soon
                _ => throw new ArgumentException("Invalid file type")
            };

            var messages = result.ToList();
            if (!messages.Any())
                throw new Exception("No messages extracted");

            var groupedByDay = messages.GroupBy(x => x.Date);

            int historyCount = 0;
            int chatCount = 0;
            int memoryCount = 0;
            int callCount = 0;

            foreach (var dayGroup in groupedByDay)
            {
                var historyItem = await _dbContext.HistoryInstance
                .FirstOrDefaultAsync(h => h.HistoryDate == dayGroup.Key);

                if (historyItem == null)
                {
                    historyItem = new HistoryInstance { HistoryDate = dayGroup.Key };
                    _dbContext.HistoryInstance.Add(historyItem);
                    await _dbContext.SaveChangesAsync();
                    historyCount++;
                }

                _dbContext.HistoryInstance.Add(historyItem);
                await _dbContext.SaveChangesAsync();

                historyCount++;

                foreach (var item in dayGroup)
                {
                    var chatItem = new Chat
                    {
                        CreatedAt = item.CreatedAt,
                        Author = item.Author,
                        MessageType = item.MessageFormat,
                        MessageDescription = item.Message
                    };

                    _dbContext.Chats.Add(chatItem);
                    await _dbContext.SaveChangesAsync();

                    chatCount++;
                    if(item.MessageFormat==MessageFormatEnum.VoiceCall|| item.MessageFormat == MessageFormatEnum.VideoCall)
                    {
                        var callRes = await _formatService.ExtractCallDataAsync(item);
                        if (callRes != null)
                        {
                            var callItem = new Call
                            {
                                ChatId = chatItem.ChatId,
                                CallState = callRes.CallState,
                                Duration = callRes.Duration
                            };

                            _dbContext.Call.Add(callItem);
                            callCount++;
                        }
                    }
                    

                    var memoryItem = new MemoryItem
                    {
                        Type = MemoryTypeEnum.Chat,
                        CreatedAt = item.CreatedAt,
                        ChatId = chatItem.ChatId,
                        HistoryInstanceId = historyItem.HistoryInstanceId
                    };

                    _dbContext.MemoryItem.Add(memoryItem);
                    memoryCount++;
                }

                await _dbContext.SaveChangesAsync();
            }

            return new ImportResultDto
            {
                Type = FileTypeEnum.chat,
                TotalMessages = messages.Count,
                HistoryInstancesCreated = historyCount,
                ChatsCreated = chatCount,
                MemoryItemsCreated = memoryCount
            };
        }

        public async Task<ImportResultDto> ImportImageHistory(FileImportDto chat)
        {
            var result = await _formatService.ImageToGoogleDriveLinkAsync(chat.formFile);

            if (result == null || !result.Any())
                throw new Exception("No images extracted");

            var groupedByDay = result.GroupBy(x => x.Date);

            int historyCount = 0;
            int imageCount = 0;
            int memoryCount = 0;

            foreach (var dayGroup in groupedByDay)
            {
                var historyItem = await _dbContext.HistoryInstance
                .FirstOrDefaultAsync(h => h.HistoryDate == dayGroup.Key);

                if (historyItem == null)
                {
                    historyItem = new HistoryInstance { HistoryDate = dayGroup.Key };
                    _dbContext.HistoryInstance.Add(historyItem);
                    await _dbContext.SaveChangesAsync();
                    historyCount++;
                }

                _dbContext.HistoryInstance.Add(historyItem);
                await _dbContext.SaveChangesAsync();

                historyCount++;

                foreach (var item in dayGroup)
                {
                    // IMAGE ENTITY
                    var imageItem = new Image
                    {
                        CreatedAt = item.CreatedAt,
                        Title = item.Title,
                        FileDetails = item.FileDetails
                    };

                    _dbContext.Images.Add(imageItem);
                    await _dbContext.SaveChangesAsync();

                    imageCount++;

                    // MEMORY LINK
                    var memoryItem = new MemoryItem
                    {
                        Type = MemoryTypeEnum.Image,
                        CreatedAt = item.CreatedAt,
                        ImageId = imageItem.ImageId,
                        HistoryInstanceId = historyItem.HistoryInstanceId
                    };

                    _dbContext.MemoryItem.Add(memoryItem);

                    memoryCount++;
                }

                await _dbContext.SaveChangesAsync();
            }

            return new ImportResultDto
            {
                Type = FileTypeEnum.images,
                TotalMessages = result.Count,
                HistoryInstancesCreated = historyCount,
                ImagesCreated =imageCount,
                MemoryItemsCreated = memoryCount
            };
        }

        public async Task<ImportResultDto> ImportVideoHistory(FileImportDto chat)
        {
            var result = await _formatService.VideoToGoogleDriveLinkAsync(chat.formFile);

            if (result == null || !result.Any())
                throw new Exception("No videos extracted");

            var groupedByDay = result.GroupBy(x => x.Date);
            int historyCount = 0;
            int videoCount = 0;
            int memoryCount = 0;

            foreach (var dayGroup in groupedByDay)
            {
                var historyItem = await _dbContext.HistoryInstance
                .FirstOrDefaultAsync(h => h.HistoryDate == dayGroup.Key);

                if (historyItem == null)
                {
                    historyItem = new HistoryInstance { HistoryDate = dayGroup.Key };
                    _dbContext.HistoryInstance.Add(historyItem);
                    await _dbContext.SaveChangesAsync();
                    historyCount++;
                }

                _dbContext.HistoryInstance.Add(historyItem);
                await _dbContext.SaveChangesAsync();

                historyCount++;

                foreach (var item in dayGroup)
                {
                    var videoItem = new Video
                    {
                        CreatedAt = item.CreatedAt,
                        Title = item.Title,
                        FileDetails = item.FileDetails,
                        DurationInSeconds = (decimal)item.DurationSeconds
                    };

                    _dbContext.Videos.Add(videoItem);
                    await _dbContext.SaveChangesAsync();
                    videoCount++;

                    var memoryItem = new MemoryItem
                    {
                        Type = MemoryTypeEnum.Video, 
                        CreatedAt = item.CreatedAt,
                        VideoId = videoItem.VideoId,
                        HistoryInstanceId = historyItem.HistoryInstanceId
                    };

                    _dbContext.MemoryItem.Add(memoryItem);
                    memoryCount++;
                }

                await _dbContext.SaveChangesAsync();

            }
            return new ImportResultDto
            {
                Type = FileTypeEnum.images,
                TotalMessages = result.Count,
                HistoryInstancesCreated = historyCount,
                ChatsCreated = 0,
                VideosCreated = videoCount,
                MemoryItemsCreated = memoryCount
            };
        }
        public async Task<ImportResultDto> ImportMediaHistory(FileImportDto chat)
        {
            // file folder combined , audio ,stickers,images , videos,
            //keep videos and images only 
            var imageFiles = chat.formFile
            .Where(f =>  _formatService.IsImage(f))
            .ToList();

            var videoFiles = chat.formFile
                .Where(f =>  _formatService.IsVideo(f))
                .ToList();

            if (!imageFiles.Any() && !videoFiles.Any())
                throw new Exception("No images or videos found in the uploaded files");

            // Process both using existing formatters
            var imageResults = imageFiles.Any()
                ? await _formatService.ImageToGoogleDriveLinkAsync(imageFiles)
                : new List<ExtractImageDto>();

            var videoResults = videoFiles.Any()
                ? await _formatService.VideoToGoogleDriveLinkAsync(videoFiles)
                : new List<ExtractVideoDto>();

            // Merge and group everything by day
            var allDates = imageResults.Select(x => x.Date)
                .Concat(videoResults.Select(x => x.Date))
                .Distinct();

            int historyCount = 0;
            int imageCount = 0;
            int videoCount = 0;
            int memoryCount = 0;

            foreach (var day in allDates.OrderBy(d => d))
            {
                var historyItem = await _dbContext.HistoryInstance
                .FirstOrDefaultAsync(h => h.HistoryDate == day);

                if (historyItem == null)
                {
                    historyItem = new HistoryInstance { HistoryDate = day };
                    _dbContext.HistoryInstance.Add(historyItem);
                    await _dbContext.SaveChangesAsync();
                    historyCount++;
                }
                // Images for this day
                foreach (var item in imageResults.Where(x => x.Date == day))
                {
                    var imageItem = new Image
                    {
                        CreatedAt = item.CreatedAt,
                        Title = item.Title,
                        FileDetails = item.FileDetails
                    };
                    _dbContext.Images.Add(imageItem);
                    await _dbContext.SaveChangesAsync();
                    imageCount++;

                    _dbContext.MemoryItem.Add(new MemoryItem
                    {
                        Type = MemoryTypeEnum.Image,
                        CreatedAt = item.CreatedAt,
                        ImageId = imageItem.ImageId,
                        HistoryInstanceId = historyItem.HistoryInstanceId
                    });
                    memoryCount++;
                }

                // Videos for this day
                foreach (var item in videoResults.Where(x => x.Date == day))
                {
                    var videoItem = new Video
                    {
                        CreatedAt = item.CreatedAt,
                        Title = item.Title,
                        FileDetails = item.FileDetails,
                        DurationInSeconds = (decimal)item.DurationSeconds
                    };
                    _dbContext.Videos.Add(videoItem);
                    await _dbContext.SaveChangesAsync();
                    videoCount++;

                    _dbContext.MemoryItem.Add(new MemoryItem
                    {
                        Type = MemoryTypeEnum.Video,
                        CreatedAt = item.CreatedAt,
                        VideoId = videoItem.VideoId,
                        HistoryInstanceId = historyItem.HistoryInstanceId
                    });
                    memoryCount++;
                }

                await _dbContext.SaveChangesAsync();
            }

            return new ImportResultDto
            {
                Type = FileTypeEnum.media,
                TotalMessages = imageResults.Count + videoResults.Count,
                HistoryInstancesCreated = historyCount,
                ImagesCreated = imageCount,
                VideosCreated = videoCount,
                MemoryItemsCreated = memoryCount
            };

        }

        public async Task ClearImportData(FileTypeEnum file, int? id)
        {
            if (id == null)
                throw new ArgumentNullException(nameof(id));

            MemoryItem? memoryItem = null;

            switch (file)
            {
                case FileTypeEnum.chat:
                    memoryItem = await _dbContext.MemoryItem
                        .Include(m => m.Chat)
                        .Include(m => m.HistoryInstance)
                        .FirstOrDefaultAsync(m => m.ChatId == id);
                    break;

                case FileTypeEnum.images:
                    memoryItem = await _dbContext.MemoryItem
                        .Include(m => m.Image)
                        .Include(m => m.HistoryInstance)
                        .FirstOrDefaultAsync(m => m.ImageId == id);
                    break;

                case FileTypeEnum.video:
                    memoryItem = await _dbContext.MemoryItem
                        .Include(m => m.Video)
                        .Include(m => m.HistoryInstance)
                        .FirstOrDefaultAsync(m => m.VideoId == id);
                    break;
            }

            if (memoryItem == null)
                return;

            var historyInstanceId = memoryItem.HistoryInstanceId;

            // Remove actual entity
            switch (file)
            {
                case FileTypeEnum.chat:
                    if (memoryItem.Chat != null)
                        _dbContext.Chats.Remove(memoryItem.Chat);
                    break;

                case FileTypeEnum.images:
                    if (memoryItem.Image != null)
                        _dbContext.Images.Remove(memoryItem.Image);
                    break;

                case FileTypeEnum.video:
                    if (memoryItem.Video != null)
                        _dbContext.Videos.Remove(memoryItem.Video);
                    break;
            }

            // Remove MemoryItem
            _dbContext.MemoryItem.Remove(memoryItem);

            await _dbContext.SaveChangesAsync();

            // Remove HistoryInstance only if it became empty
            bool hasOtherMemories = await _dbContext.MemoryItem
                .AnyAsync(m => m.HistoryInstanceId == historyInstanceId);

            if (!hasOtherMemories)
            {
                var history = await _dbContext.HistoryInstance
                    .FirstOrDefaultAsync(h => h.HistoryInstanceId == historyInstanceId);

                if (history != null)
                {
                    _dbContext.HistoryInstance.Remove(history);
                    await _dbContext.SaveChangesAsync();
                }
            }
        }

        public async Task<bool> ClearImportData(FileTypeEnum clearImport)
        {
            try
            {
                switch (clearImport)
                {
                    case FileTypeEnum.chat:
                        var chats = await _dbContext.MemoryItem
                            .Where(m => m.ChatId != null)
                            .Include(m => m.Chat)
                            .ToListAsync();

                        _dbContext.Chats.RemoveRange(
                            chats.Where(x => x.Chat != null)
                                 .Select(x => x.Chat));
                        _dbContext.MemoryItem.RemoveRange(chats);
                        break;

                    case FileTypeEnum.images:

                        var images = await _dbContext.MemoryItem
                            .Where(m => m.ImageId != null)
                            .Include(m => m.Image)
                            .ToListAsync();

                        _dbContext.Images.RemoveRange(
                            images.Where(x => x.Image != null)
                                  .Select(x => x.Image));

                        _dbContext.MemoryItem.RemoveRange(images);

                        break;

                    case FileTypeEnum.video:

                        var videos = await _dbContext.MemoryItem
                            .Where(m => m.VideoId != null)
                            .Include(m => m.Video)
                            .ToListAsync();

                        _dbContext.Videos.RemoveRange(
                            videos.Where(x => x.Video != null)
                                  .Select(x => x.Video));

                        _dbContext.MemoryItem.RemoveRange(videos);

                        break;
                }

                await _dbContext.SaveChangesAsync();

                // remove empty days
                var emptyHistory = await _dbContext.HistoryInstance
                    .Where(h => !_dbContext.MemoryItem
                        .Any(m => m.HistoryInstanceId == h.HistoryInstanceId))
                    .ToListAsync();

                _dbContext.HistoryInstance.RemoveRange(emptyHistory);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        Task IDataFormatter.ClearImportData(FileTypeEnum clearImport)
        {
            return ClearImportData(clearImport);
        }
        //Task IDataFormatter.ClearImportData(FileTypeEnum clearImport)
        //{
        //    return ClearImportData(clearImport);
        //}
    }
}

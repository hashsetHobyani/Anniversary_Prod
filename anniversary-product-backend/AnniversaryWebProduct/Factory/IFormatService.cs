using AnniversaryWebProduct.ViewModels;
using MetadataExtractor;
using MetadataExtractor.Formats.Exif;
using MetadataExtractor.Formats.QuickTime;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Globalization;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;

namespace AnniversaryWebProduct.Factory
{
    public interface IFormatService
    {
        Task<List<ExtractMessageDto>> TXTExtractTextAsync(IFormFile file);
        //Task<string> PDFExtractTextAsync(IFormFile file);
        Task<ExtractCallDto> ExtractCallDataAsync(ExtractMessageDto result);
        Task<List<ExtractImageDto>> ImageToGoogleDriveLinkAsync(List<IFormFile> file);
        Task<List<ExtractVideoDto>> VideoToGoogleDriveLinkAsync(List<IFormFile> file);
        public bool IsImage(IFormFile file);
        public bool IsVideo(IFormFile file);
    }
    public class FormatService : IFormatService
    {
        private static readonly Regex MessageRegex = new(
        @"^\u200E?\[(?<date>\d{4}/\d{2}/\d{2}),\s(?<time>\d{2}:\d{2}:\d{2})\]\s(?<author>.*?):\s(?<message>.*)$",
        RegexOptions.Compiled);
        private static readonly Regex MediaFilenameRegex = new(
        @"\d+-(?:VIDEO|PHOTO|MOV)-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);
        private readonly ICloudFareR2Service _cloudFareR2Service;
        public FormatService(ICloudFareR2Service cloudFareR2Service)
        {
            _cloudFareR2Service = cloudFareR2Service;
        }

        public async Task<List<ExtractMessageDto>> TXTExtractTextAsync(IFormFile file)
        {
            var result = new List<ExtractMessageDto>();
            using var reader = new StreamReader(file.OpenReadStream());

            ExtractMessageDto? currentMessage = null;

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();

                if (string.IsNullOrWhiteSpace(line))
                    continue;

                var match = MessageRegex.Match(line);

                // New message
                if (match.Success)
                {
                    if (currentMessage != null)
                        result.Add(currentMessage);

                    currentMessage = CreateMessage(match);
                }
                else
                {
                    // Multiline message
                    if (currentMessage != null)
                    {
                        currentMessage.Message +=
                            Environment.NewLine + line;
                    }
                }
            }

            if (currentMessage != null)
                result.Add(currentMessage);

            return result;
        }
       public async Task<ExtractCallDto> ExtractCallDataAsync(ExtractMessageDto result)
        {
            if (string.IsNullOrEmpty(result.Message))
            {
                return null;
            }
   
            //format return data 
            var callResult = new ExtractCallDto
            {
                CallState = ParseCallState(result.Message),
                Duration = ParseDuration(result.Message)
            };

            return callResult;

        }
        //public async Task<List<ExtractMessageDto>> PDFExtractTextAsync(List<IFormFile> file)
        //{
        //    foreach (var fileItem in file) {
        //        using var memoryStream = new MemoryStream();
        //        await fileItem.CopyToAsync(memoryStream);
        //        memoryStream.Position = 0;

        //        var sb = new StringBuilder();

        //        using var pdf = PdfDocument.Open(memoryStream);

        //        foreach (var page in pdf.GetPages())
        //        {
        //            sb.AppendLine(page.Text);
        //        }

        //        return sb.ToString();
        //    }
        //    // process chat result string into json  and deserailes into model list <<ExtractMessageDto>>

        //}
        // Image Format
        // Image Format
        // Image Format
        // Image Format
        public async Task<List<ExtractImageDto>> ImageToGoogleDriveLinkAsync(List<IFormFile> file)
        {
            var Imagelist = new List<ExtractImageDto>();
            foreach (var fileItem in file)
            {
                DateTime takenDate;
                using (var stream = fileItem.OpenReadStream())
                {
                    takenDate = GetImageTakenDate(stream,fileItem.FileName);
                }
                var url = await _cloudFareR2Service.UploadImageR2Async(fileItem);
                Imagelist.Add(new ExtractImageDto
                {
                    Date = DateOnly.FromDateTime(takenDate),
                    CreatedAt = takenDate,
                    Title = fileItem.FileName,
                    FileDetails = url
                });
            }

            return Imagelist;

        }


        // Video Format
        // Video Format
        // Video Format
        // Video Format

        public async Task<List<ExtractVideoDto>> VideoToGoogleDriveLinkAsync(List<IFormFile> file)
        {
            var videolist =  new List<ExtractVideoDto>();

            foreach (var fileItem in file)
            {
                var createdAt = GetVideoTakenDate(fileItem);
                var duration = GetVideoDurationSeconds(fileItem);
                var url = await _cloudFareR2Service.UploadVideoR2Async(fileItem);

                videolist.Add(new ExtractVideoDto
                {
                    Date = DateOnly.FromDateTime(createdAt),
                    CreatedAt = createdAt,
                    Title = fileItem.FileName,
                    DurationSeconds = duration,
                    FileDetails = url
                });
            }

            return videolist;
        }



        private ExtractMessageDto CreateMessage(Match match)
        {
            var dateString = match.Groups["date"].Value;
            var timeString = match.Groups["time"].Value;
            var authorString = match.Groups["author"].Value;
            var messageString = match.Groups["message"].Value;

            var createdAt = DateTime.ParseExact(
                $"{dateString} {timeString}",
                "yyyy/MM/dd HH:mm:ss",
                CultureInfo.InvariantCulture);

            return new ExtractMessageDto
            {
                Date = DateOnly.FromDateTime(createdAt),
                CreatedAt = createdAt,
                Author = DetermineAuthor(authorString),
                Message = CleanMessage(messageString),
                MessageFormat = DetermineMessageFormat(messageString)
            };
        }

        private static string CleanMessage(string message)
        {
            return message
                .Replace("\u200E", "")
                .Trim();
        }

        private AuthorEnum DetermineAuthor(string author)
        {
            if (author.Contains("Hobyani",
                    StringComparison.OrdinalIgnoreCase))
            {
                return AuthorEnum.Me;
            }

            return AuthorEnum.Her;
        }

        private MessageFormatEnum DetermineMessageFormat(string message)
        {
            var lower = message.ToLower();
            if (lower.Contains("audio omitted"))
                return MessageFormatEnum.VoiceNote;

            if (lower.Contains("voice call"))
                return MessageFormatEnum.VoiceCall;

            if (lower.Contains("video call"))
                return MessageFormatEnum.VideoCall;

            if (lower.Contains("image omitted"))
                return MessageFormatEnum.ImageShared;

            if (lower.Contains("sticker omitted"))
                return MessageFormatEnum.AttachmentShared;

            if (lower.Contains("video omitted"))
                return MessageFormatEnum.AttachmentShared;

            if (lower.Contains("document omitted"))
                return MessageFormatEnum.AttachmentShared;

            if (lower.Contains("gif omitted"))
                return MessageFormatEnum.AttachmentShared;

            if (lower.Contains("view once"))
                return MessageFormatEnum.ViewOnce;

            return MessageFormatEnum.Message;
        }
        private CallStateEnum ParseCallState(string? message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return CallStateEnum.Answered;

            message = message.ToLowerInvariant();

            if (message.Contains("no answer"))
                return CallStateEnum.Missed;

            if (message.Contains("missed"))
                return CallStateEnum.Missed;

            return CallStateEnum.Answered;
        }
        private int ParseDuration(string? message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return 0;

            int totalMinutes = 0;

            var hourMatch = Regex.Match(message, @"(\d+)\s*hr");

            if (hourMatch.Success)
            {
                totalMinutes += int.Parse(hourMatch.Groups[1].Value) * 60;
            }

            var minuteMatch = Regex.Match(message, @"(\d+)\s*min");

            if (minuteMatch.Success)
            {
                totalMinutes += int.Parse(minuteMatch.Groups[1].Value);
            }

            return totalMinutes;
        }
        private DateTime GetImageTakenDate(Stream stream, string fileName)
        {
            // Filename first
            var fromFilename = TryGetDateFromWhatsAppExportFilename(fileName);
            if (fromFilename.HasValue) return fromFilename.Value;

            //  Original EXIF logic unchanged
            var directories = ImageMetadataReader.ReadMetadata(stream);
            var subIfd = directories.OfType<ExifSubIfdDirectory>().FirstOrDefault();
            if (subIfd != null && subIfd.TryGetDateTime(ExifDirectoryBase.TagDateTimeOriginal, out var date))
                return date;

            // fallback
            return DateTime.UtcNow;
        }

        private DateTime GetVideoTakenDate(IFormFile file) =>
            TryGetDateFromWhatsAppExportFilename(file.FileName)  //  filename first
            ?? TryGetDateFromMetadataExtractor(file)              //  original embedded atoms
            ?? TryGetDateFromFilename(file.FileName)              //  original generic filename
            ?? DateTime.UtcNow;

        private DateTime? TryGetDateFromMetadataExtractor(IFormFile file)
        {
            try
            {
                using var stream = file.OpenReadStream();
                var directories = ImageMetadataReader.ReadMetadata(stream);

                // ① QuickTime movie header — most reliable, works on MOV/MP4 from iPhone/Android/DSLR
                var qtHeader = directories.OfType<QuickTimeMovieHeaderDirectory>().FirstOrDefault();
                if (qtHeader?.TryGetDateTime(QuickTimeMovieHeaderDirectory.TagCreated, out var qtDate) == true)
                    return AsUtc(qtDate);

                // ② Generic scan — catches Apple metadata atom, MKV tags, MP4 Encoded_Date etc.
                //    No QuickTimeMetadataDirectory needed — we search all directories by tag name
                foreach (var dir in directories)
                {
                    foreach (var tag in dir.Tags)
                    {
                        bool isDateTag =
                            tag.Name.Contains("Date", StringComparison.OrdinalIgnoreCase) ||
                            tag.Name.Contains("Created", StringComparison.OrdinalIgnoreCase) ||
                            tag.Name.Contains("Creation", StringComparison.OrdinalIgnoreCase);

                        if (!isDateTag) continue;

                        // Try typed DateTime first
                        if (dir.TryGetDateTime(tag.Type, out var typed))
                            return AsUtc(typed);

                        // Fall back to parsing the raw description string
                        if (!string.IsNullOrEmpty(tag.Description) &&
                            TryParseMediaInfoDate(tag.Description, out var parsed))
                            return parsed;
                    }
                }
            }
            catch { /* unsupported container or non-seekable stream */ }

            return null;
        }
        private static readonly Regex[] FilenamePatterns =
        [
            new(@"(\d{4})(\d{2})(\d{2})[_-](\d{2})(\d{2})(\d{2})", RegexOptions.Compiled),
             new(@"(\d{4})-(\d{2})-(\d{2})",RegexOptions.Compiled),
        ];

        private static DateTime? TryGetDateFromFilename(string fileName)
        { //no format include fallback regex
            var name = Path.GetFileNameWithoutExtension(fileName);

            foreach (var pattern in FilenamePatterns)
            {
                var m = pattern.Match(name);
                if (!m.Success) continue;

                if (int.TryParse(m.Groups[1].Value, out int y) &&
                    int.TryParse(m.Groups[2].Value, out int mo) &&
                    int.TryParse(m.Groups[3].Value, out int d) &&
                    mo is >= 1 and <= 12 && d is >= 1 and <= 31)
                {
                    try { return new DateTime(y, mo, d, 0, 0, 0, DateTimeKind.Local).ToUniversalTime(); }
                    catch { }
                }
            }

            return null;
        }
        private DateTime? TryGetDateFromWhatsAppExportFilename(string fileName)
        {
            var match = MediaFilenameRegex.Match(fileName);
            if (!match.Success) return null;

            return new DateTime(
                int.Parse(match.Groups[1].Value), // year
                int.Parse(match.Groups[2].Value), // month
                int.Parse(match.Groups[3].Value), // day
                int.Parse(match.Groups[4].Value), // hour
                int.Parse(match.Groups[5].Value), // minute
                int.Parse(match.Groups[6].Value), // second
                DateTimeKind.Local
            );
        }
        private static bool TryParseMediaInfoDate(string raw, out DateTime result)
        {
            result = default;
            if (string.IsNullOrWhiteSpace(raw)) return false;

            var cleaned = Regex.Replace(raw.Trim(), @"^UTC\s+", "", RegexOptions.IgnoreCase);

            string[] formats =
            [
                "yyyy-MM-dd HH:mm:ss",
                "yyyy-MM-ddTHH:mm:ssZ",
                "yyyy-MM-ddTHH:mm:ss",
                "yyyy-MM-ddTHH:mm:sszzz",
                "yyyy-MM-dd",
                "dd/MM/yyyy HH:mm:ss",
                "MM/dd/yyyy HH:mm:ss",
            ];

            if (DateTime.TryParseExact(cleaned, formats,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out result))
                return true;

            return DateTime.TryParse(cleaned, CultureInfo.InvariantCulture,
                DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out result);
        }
        private static double GetVideoDurationSeconds(IFormFile file)
        {
            try
            {
                using var stream = file.OpenReadStream();
                var directories = ImageMetadataReader.ReadMetadata(stream);

                var qtHeader = directories.OfType<QuickTimeMovieHeaderDirectory>().FirstOrDefault();
                if (qtHeader != null)
                {
                    // Duration is stored as ticks; TimeScale converts to seconds
                    if (qtHeader.TryGetInt64(QuickTimeMovieHeaderDirectory.TagDuration, out long durationTicks) &&
                        qtHeader.TryGetInt32(QuickTimeMovieHeaderDirectory.TagTimeScale, out int timeScale) &&
                        timeScale > 0)
                    {
                        return (double)durationTicks / timeScale;
                    }
                }

                // ② Generic fallback — scan all directories for a duration tag
                //    Covers MKV, AVI, and other containers MetadataExtractor supports
                foreach (var dir in directories)
                    foreach (var tag in dir.Tags)
                    {
                        if (!tag.Name.Contains("Duration", StringComparison.OrdinalIgnoreCase))
                            continue;

                        // Some directories expose it as a typed double directly
                        if (dir.TryGetDouble(tag.Type, out double seconds) && seconds > 0)
                            return seconds;

                        // Others expose it as a formatted string like "0:01:23.456" or "83456ms"
                        if (!string.IsNullOrWhiteSpace(tag.Description) &&
                            TryParseDurationString(tag.Description, out double parsed))
                            return parsed;
                    }
            }
            catch { }

            return 0;
        }
        private static bool TryParseDurationString(string raw, out double seconds)
        {
            seconds = 0;
            if (string.IsNullOrWhiteSpace(raw)) return false;

            // Milliseconds suffix: "83456ms"
            if (raw.EndsWith("ms", StringComparison.OrdinalIgnoreCase) &&
                double.TryParse(raw[..^2], NumberStyles.Any, CultureInfo.InvariantCulture, out double ms))
            {
                seconds = ms / 1000.0;
                return true;
            }

            // Seconds suffix: "83.4s"
            if (raw.EndsWith('s') &&
                double.TryParse(raw[..^1], NumberStyles.Any, CultureInfo.InvariantCulture, out double s))
            {
                seconds = s;
                return true;
            }

            // TimeSpan format: "0:01:23.456" or "1:23:45"
            if (TimeSpan.TryParse(raw, CultureInfo.InvariantCulture, out var ts))
            {
                seconds = ts.TotalSeconds;
                return true;
            }

            // Plain number
            if (double.TryParse(raw, NumberStyles.Any, CultureInfo.InvariantCulture, out double plain))
            {
                seconds = plain;
                return true;
            }

            return false;
        }
        private static DateTime AsUtc(DateTime dt) =>
            dt.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(dt, DateTimeKind.Utc)
                : dt.ToUniversalTime();



        private static readonly HashSet<string> ImageExtensions =
            new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", };

        private static readonly HashSet<string> VideoExtensions =
            new(StringComparer.OrdinalIgnoreCase) { ".mp4", ".mov", ".mkv", ".avi", ".3gp" };

        public bool IsImage(IFormFile file) =>
            ImageExtensions.Contains(Path.GetExtension(file.FileName));

        public bool IsVideo(IFormFile file) =>
            VideoExtensions.Contains(Path.GetExtension(file.FileName));
    }

    public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
    {
        public UtcDateTimeConverter() : base(
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc))
        { }
    }

    public class NullableUtcDateTimeConverter : ValueConverter<DateTime?, DateTime?>
    {
        public NullableUtcDateTimeConverter() : base(
            v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v,
            v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v)
        { }
    }
    public class ExtractMessageDto
    {
        public DateOnly Date {  get; set; } // used for historic instance
        public DateTime CreatedAt { get; set; } //used for memory instance
        public AuthorEnum Author { get; set; }
        public string? Message { get; set; } 
        public MessageFormatEnum MessageFormat { get; set; } 
            
    }
    public class ExtractVideoDto
    {
        public DateOnly Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Title { get; set; }
        public string FileDetails { get; set; }
        public double DurationSeconds { get; set; }
    }
    public class ExtractImageDto
    {
        public DateOnly Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Title { get; set; }
        public string FileDetails { get; set; }
    }
    public class ExtractCallDto
    {
        public CallStateEnum CallState { get; set; }
        public decimal Duration { get; set; } = 0;

    }
}
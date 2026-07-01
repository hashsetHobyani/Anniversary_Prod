using System.Configuration;
using Amazon.S3;
using Amazon.S3.Model;
namespace AnniversaryWebProduct.Factory
{
    public interface ICloudFareR2Service
    {
        Task<string> UploadImageR2Async(IFormFile file);

        Task<string> UploadVideoR2Async(IFormFile file);

        Task DeleteAsync(string key);
    }
    public class CloudFareR2Service: ICloudFareR2Service
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _bucketName;
        private readonly string _accountId;
        private readonly IAmazonS3 _s3;
        private readonly string _publicBaseUrl;
        public CloudFareR2Service(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            var accessKey = _configuration["CloudflareR2:AccessKey"];
            var secretKey = _configuration["CloudflareR2:SecretKey"];
            _bucketName = _configuration["CloudflareR2:BucketName"] ?? "";
            _publicBaseUrl = configuration["CloudflareR2:PublicAccess"] ??"";

            _s3 = new AmazonS3Client(
                    accessKey,
                    secretKey,
                    new AmazonS3Config
                    {
                        ServiceURL = _configuration["CloudflareR2:Endpoint"],
                        ForcePathStyle = true,

                        DisableLogging = false,
                       
                    });
        }

        public async Task<string> UploadImageR2Async(IFormFile file)
        {
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            using var stream = file.OpenReadStream();

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType,
                //CannedACL = S3CannedACL.PublicRead
                DisablePayloadSigning = true
            };

            try
            {
                await _s3.PutObjectAsync(request);
            }
            catch (AmazonS3Exception ex)
            {
                Console.WriteLine($"ErrorCode: {ex.ErrorCode}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"StatusCode: {ex.StatusCode}");
                throw;
            }

            return $"{_publicBaseUrl}/{fileName}";
        }

        public async Task<string> UploadVideoR2Async(IFormFile file)
        {
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            using var stream = file.OpenReadStream();

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType,
                //CannedACL = S3CannedACL.PublicRead
                DisablePayloadSigning = true
            };

            try
            {
                await _s3.PutObjectAsync(request);
            }
            catch (AmazonS3Exception ex)
            {
                Console.WriteLine($"ErrorCode: {ex.ErrorCode}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"StatusCode: {ex.StatusCode}");
                throw;
            }

            return $"{_publicBaseUrl}/{fileName}";
        }

        public Task DeleteAsync(string key)
        {
            throw new NotImplementedException();
        }
    }
}

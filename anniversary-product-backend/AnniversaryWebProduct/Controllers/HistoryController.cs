using AnniversaryWebProduct.Factory;
using AnniversaryWebProduct.Models;
using AnniversaryWebProduct.ViewModels;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AnniversaryWebProduct.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly IDataFormatter _dataFormatter;
        public HistoryController(IDataFormatter dataFormatter)
        {
            _dataFormatter = dataFormatter;
        }
        [HttpGet("filesUsed")]
        public async Task<IActionResult> ActiveFiles()
        {
            return Ok(await _dataFormatter.GetFilesUsed());

        }
        [HttpPost("import")]
        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue, ValueCountLimit = int.MaxValue)]
        public async Task<IActionResult> ImportFiles([FromForm] FileImportDto fileImport)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (fileImport.formFile == null || !fileImport.formFile.Any())
                return BadRequest("No files provided");

            try
            {
                var result = fileImport.Type switch
                {
                    FileTypeEnum.chat =>
                        await _dataFormatter.ImportChatHistory(fileImport),
                    FileTypeEnum.media =>
                        await _dataFormatter.ImportMediaHistory(fileImport),
                    FileTypeEnum.video =>
                        await _dataFormatter.ImportVideoHistory(fileImport),
                    FileTypeEnum.images =>
                        await _dataFormatter.ImportImageHistory(fileImport),


                    _ => throw new ArgumentException("Invalid file type")
                };

                return Ok(new
                {
                    message = "Files successfully imported",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Import failed",
                    error = ex.Message
                });
            }
        }

        // =========================
        // IMPORT AS NEW (REPLACE)
        // =========================
        [HttpPost("import/new")]
        public async Task<IActionResult> ImportAsNew([FromBody] ImportAsNewRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _dataFormatter.ClearImportData(request.OldFileType);

                object result;

                switch (request.NewFileImport.Type)
                {
                    case FileTypeEnum.chat:
                        result = await _dataFormatter.ImportChatHistory(request.NewFileImport);
                        break;

                    case FileTypeEnum.video:
                        result = await _dataFormatter.ImportVideoHistory(request.NewFileImport);
                        break;

                    case FileTypeEnum.images:
                        result = await _dataFormatter.ImportImageHistory(request.NewFileImport);
                        break;

                    default:
                        throw new ArgumentException("Invalid file type");
                }
                return Ok(new
                {
                    message = "Files successfully imported as new",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Import as new failed",
                    error = ex.Message
                });
            }
        }

        // =========================
        // CLEAR BY TYPE
        // =========================
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearImportType([FromBody] FileTypeEnum fileType)
        {
            try
            {
                await _dataFormatter.ClearImportData(fileType);

                return Ok(new
                {
                    message = "Files successfully cleared"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Clear failed",
                    error = ex.Message
                });
            }
        }

        // =========================
        // CLEAR BY TYPE + ID
        // =========================
        [HttpDelete("clear/{id}")]
        public async Task<IActionResult> ClearImportTypeId(int id, [FromQuery] FileTypeEnum fileType)
        {
            try
            {
                await _dataFormatter.ClearImportData(fileType, id);

                return Ok(new
                {
                    message = "File successfully cleared",
                    id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Clear by id failed",
                    error = ex.Message
                });
            }
        }

    }
}

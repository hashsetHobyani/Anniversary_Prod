using AnniversaryWebProduct.Models;
using AnniversaryWebProduct.ViewModels;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
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
    public class TimesController : ControllerBase
    {
        private readonly AppDbContext _dbcontext;

        public TimesController(AppDbContext context)
        {
            _dbcontext = context;
        }

        // GET: api/Times
        [HttpGet]
        public async Task<ActionResult<TimerDto>> GetTimer()
        {
            var timer = await _dbcontext.Timer.FirstAsync();

            return Ok(new TimerDto
            {
                Id = timer.Id,
                TimerName = timer.TimerName,
                DateStart = timer.DateStart,
                DateEnd = timer.DateEnd,
                IsActive = timer.IsActive
            });
        }
        [HttpPut("updateTimer")]
        public async Task<IActionResult> PutTime(TimerDto time)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

           var oldTime = _dbcontext.Timer.FirstOrDefault(x=>x.Id==time.Id);
            if (oldTime ==null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(time.TimerName)) oldTime.TimerName = time.TimerName;
            oldTime.DateStart = time.DateStart;
            oldTime.DateEnd = time.DateEnd;
            oldTime.IsActive = time.IsActive;

            try
            {
                await _dbcontext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeExists(time.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new
            {
                message = "Date successfully updated",
                data = await _dbcontext.Timer.FirstAsync(x=>x.Id==time.Id)
            });
        }

        private bool TimeExists(int id)
        {
            return _dbcontext.Timer.Any(e => e.Id == id);
        }
    }
}

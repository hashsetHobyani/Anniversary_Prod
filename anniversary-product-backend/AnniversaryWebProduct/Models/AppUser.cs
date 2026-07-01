using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AnniversaryWebProduct.Models
{
    public class AppUserDbContext
    {
        [Required]
        [MinLength(3)] /// multiple data annotaion
        public required string Firstname { get; set; }// add data annotation 
        [Required]
        [MinLength(3)]
        public required string Lastname { get; set; }
    }
}

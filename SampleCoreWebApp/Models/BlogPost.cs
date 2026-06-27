using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleCoreWebApp.Models
{
    public class BlogPost
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public required string Title { get; set; }
        public required string Summary { get; set; }
        public required string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? ImageUrl { get; set; }
    }
}

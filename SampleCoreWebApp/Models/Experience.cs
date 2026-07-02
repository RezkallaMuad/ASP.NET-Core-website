using System.ComponentModel.DataAnnotations.Schema;

namespace SampleCoreWebApp.Models
{
    public class Experience
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Company { get; set; }
        public required string Position { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; } // e.g. "Present" or "Dec 2023"
        public string? Description { get; set; } // Text with newlines representing bullet points or markdown
        public int DisplayOrder { get; set; }
    }
}

using System.Runtime.CompilerServices;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SampleCoreWebApp.Models

{
    public class ProjectMedia
    {
        public required string Type { get; set; } // "image" or "video"
        public required string Url { get; set; }
    }

    public class Project
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Technologies { get; set; }
        public string? GitHubUrl { get; set; }
        public string? ImageUrl { get; set; }

        public string? MediaJson { get; set; }
        public string? ContributorsJson { get; set; }

        public int DisplayOrder { get; set; }

        [NotMapped]
        public List<ProjectMedia>? Media { get; set; }

        [NotMapped]
        public List<string>? Contributors { get; set; }
    }
    
}
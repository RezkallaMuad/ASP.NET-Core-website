using System.Runtime.CompilerServices;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SampleCoreWebApp.Models

{
    public class Project
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Technologies { get; set; }
        public required string GitHubUrl { get; set; }
        public required string Demo { get; set; }

    }
}
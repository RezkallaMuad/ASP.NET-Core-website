using System.Runtime.CompilerServices;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SampleCoreWebApp.Models

{
    public class Project
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public string Name { get; set; }
        public string Description { get; set; }
        public string Technologies { get; set; }
        public string GitHubUrl { get; set; }
        public string Demo { get; set; }

    }
}
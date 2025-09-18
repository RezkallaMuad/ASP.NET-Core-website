using System.Runtime.CompilerServices;

namespace SampleCoreWebApp.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string technologies { get; set; }
        public string GithubUrl { get; set; }
        public string Demo { get; set; }

    }
}
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleCoreWebApp.Models
{
    public class Skill
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Category { get; set; } // e.g. "Languages", "Frameworks", "Tools"
        public int DisplayOrder { get; set; }
    }
}

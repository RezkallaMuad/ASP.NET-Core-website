using System;
namespace SampleCoreWebApp.Models;

public class BlogPost
{
    public int ID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string? ImageUrl { get; set; }
}

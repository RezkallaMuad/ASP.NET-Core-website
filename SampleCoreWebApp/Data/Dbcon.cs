using Microsoft.EntityFrameworkCore;
using SampleCoreWebApp.Models;

namespace SampleCoreWebApp.Data
{
    public class Dbcon(DbContextOptions<Dbcon> options) : DbContext(options)
    {
        public DbSet<Project> Projects { get; set; }

        public DbSet<BlogPost> BlogPosts { get; set; }
    }
}
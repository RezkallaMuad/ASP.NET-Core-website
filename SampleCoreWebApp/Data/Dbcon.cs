using Microsoft.EntityFrameworkCore;
using SampleCoreWebApp.Models;

namespace SampleCoreWebApp.Data
{
    public class Dbcon : DbContext
    {
        public Dbcon(DbContextOptions<Dbcon> options) : base(options){}
        public DbSet<Project> Projects { get; set; }
    }
}
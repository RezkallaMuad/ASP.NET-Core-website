using Microsoft.EntityFrameworkCore;
using SampleCoreWebApp.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// -------------------
// Add services
// -------------------

// Add DbContext
builder.Services.AddDbContext<Dbcon>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Razor Pages
builder.Services.AddRazorPages();

// Add API controllers
builder.Services.AddControllers();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Adjust the origin as needed
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

// --- Seed Database for Testing ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<Dbcon>();
    await context.Database.EnsureCreatedAsync();
    
    if (!context.Projects.Any())
    {
        context.Projects.AddRange(
            new SampleCoreWebApp.Models.Project
            {
                Name = "E-Commerce Platform",
                Description = "A full-stack e-commerce solution built with ASP.NET Core and React. Features include user authentication, a shopping cart, Stripe payment integration, and an admin dashboard for managing products and orders.",
                Technologies = "C#, ASP.NET Core, React, Tailwind CSS, SQL Server",
                GitHubUrl = "https://github.com/yourusername/ecommerce",
                Demo = "https://demo.example.com",
                ImageUrl = "https://images.unsplash.com/photo-1472851294608-062f824d296e?w=800&auto=format&fit=crop",
                VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            },
            new SampleCoreWebApp.Models.Project
            {
                Name = "Task Management API",
                Description = "A robust RESTful API for task and project management. Implements JWT authentication, rate limiting, and comprehensive error handling. Fully documented with Swagger/OpenAPI.",
                Technologies = "C#, .NET 9, Entity Framework Core, SQLite, Swagger",
                GitHubUrl = "https://github.com/yourusername/task-api",
                Demo = "",
                ImageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
                VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            },
            new SampleCoreWebApp.Models.Project
            {
                Name = "Portfolio Website",
                Description = "My personal portfolio website to showcase my projects and skills. Designed to be fast, responsive, and visually appealing using modern front-end technologies.",
                Technologies = "React, TypeScript, Tailwind CSS, ASP.NET Core",
                GitHubUrl = "https://github.com/yourusername/portfolio",
                Demo = "https://myportfolio.example.com",
                ImageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
                VideoUrl = ""
            }
        );
        await context.SaveChangesAsync();
    }

    if (!context.BlogPosts.Any())
    {
        context.BlogPosts.AddRange(
            new SampleCoreWebApp.Models.BlogPost
            {
                Title = "Building a Full-Stack Website with ASP.NET Core & React",
                Summary = "How to integrate a React SPA with an ASP.NET Core API backend and run them seamlessly together.",
                Content = "Developing a modern web application often leads to using a Single Page Application (SPA) framework like React on the front-end, paired with a robust back-end like ASP.NET Core. In this article, we walk through setting up the proxy, designing API controllers, and mapping database entities using EF Core and SQLite.\n\n### Why ASP.NET Core?\nASP.NET Core is cross-platform, extremely performant, and has great tooling support for building REST APIs.\n\n### Why React?\nReact makes it easy to build dynamic, interactive, and responsive user interfaces with reusable component state.",
                CreatedAt = DateTime.Now.AddDays(-3),
                ImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop"
            },
            new SampleCoreWebApp.Models.BlogPost
            {
                Title = "A Beginner's Guide to SQLite and EF Core in .NET 9",
                Summary = "Learn how to store application data locally using SQLite, configure database connections, and write migrations.",
                Content = "SQLite is an excellent serverless SQL database engine. It is self-contained and stores your entire database in a single disk file, making it perfect for development, testing, and small-scale apps.\n\nCombined with Entity Framework Core, database management becomes as simple as defining C# classes and letting EF Core do the heavy lifting of SQL translation.",
                CreatedAt = DateTime.Now.AddDays(-1),
                ImageUrl = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop"
            }
        );
        await context.SaveChangesAsync();
    }
}


// -------------------
// Configure middleware
// -------------------
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Enable Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors();
app.UseAuthorization();

// Map API controllers
app.MapControllers();

// Map Razor Pages
app.MapRazorPages()
   .WithStaticAssets();

app.Run();

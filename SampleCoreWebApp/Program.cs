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
                Demo = "https://demo.example.com"
            },
            new SampleCoreWebApp.Models.Project
            {
                Name = "Task Management API",
                Description = "A robust RESTful API for task and project management. Implements JWT authentication, rate limiting, and comprehensive error handling. Fully documented with Swagger/OpenAPI.",
                Technologies = "C#, .NET 8, Entity Framework Core, SQLite, Swagger",
                GitHubUrl = "https://github.com/yourusername/task-api",
                Demo = ""
            },
            new SampleCoreWebApp.Models.Project
            {
                Name = "Portfolio Website",
                Description = "My personal portfolio website to showcase my projects and skills. Designed to be fast, responsive, and visually appealing using modern front-end technologies.",
                Technologies = "React, TypeScript, Tailwind CSS, ASP.NET Core",
                GitHubUrl = "https://github.com/yourusername/portfolio",
                Demo = "https://myportfolio.example.com"
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

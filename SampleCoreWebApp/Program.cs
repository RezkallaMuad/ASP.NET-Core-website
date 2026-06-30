using Microsoft.EntityFrameworkCore;
using SampleCoreWebApp.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// -------------------
// Add services
// -------------------

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID")))
{
    var homeDirectory = Environment.GetEnvironmentVariable("HOME") ?? @"C:\home";
    var dbFolder = Path.Combine(homeDirectory, "data");
    if (!Directory.Exists(dbFolder))
    {
        Directory.CreateDirectory(dbFolder);
    }
    connectionString = $"Data Source={Path.Combine(dbFolder, "SampleCoreWebApp.db")}";
}

builder.Services.AddDbContext<Dbcon>(options =>
    options.UseSqlite(connectionString));

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
        policy.AllowAnyOrigin() // Allow local standalone tool access
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

// --- Initialize Database Schema ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<Dbcon>();
    await context.Database.EnsureCreatedAsync();
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

// Enable serving React static files (from wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseCors();
app.UseAuthorization();

// Map API controllers
app.MapControllers();

// Map Razor Pages
app.MapRazorPages()
   .WithStaticAssets();

// Fallback to React client index.html for SPA route handling
app.MapFallbackToFile("index.html");

app.Run();

using Microsoft.AspNetCore.Mvc;
using SampleCoreWebApp.Filters;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace SampleCoreWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumeController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ResumeController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("/resume.pdf")]
        public IActionResult GetResume()
        {
            string filePath;
            
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID")))
            {
                // Azure: Load from persistent %HOME%/data folder
                var homeDirectory = Environment.GetEnvironmentVariable("HOME") ?? @"C:\home";
                filePath = Path.Combine(homeDirectory, "data", "resume.pdf");
            }
            else
            {
                // Local: Load from wwwroot
                var wwwRootPath = _webHostEnvironment.WebRootPath;
                if (string.IsNullOrEmpty(wwwRootPath))
                {
                    wwwRootPath = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                }
                filePath = Path.Combine(wwwRootPath, "resume.pdf");
            }

            if (!System.IO.File.Exists(filePath))
            {
                // Fallback: Check inside ContentRoot/wwwroot
                var fallbackPath = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "resume.pdf");
                if (System.IO.File.Exists(fallbackPath))
                {
                    filePath = fallbackPath;
                }
                else
                {
                    return NotFound("Resume PDF file not found. Please upload it via the admin panel.");
                }
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/pdf");
        }

        [HttpPost("upload")]
        [ApiKey]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            if (Path.GetExtension(file.FileName).ToLower() != ".pdf")
            {
                return BadRequest("Only PDF files are allowed.");
            }

            string filePath;

            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID")))
            {
                // Azure: Save to persistent %HOME%/data folder so deployments don't wipe it out
                var homeDirectory = Environment.GetEnvironmentVariable("HOME") ?? @"C:\home";
                var dataFolder = Path.Combine(homeDirectory, "data");
                if (!Directory.Exists(dataFolder))
                {
                    Directory.CreateDirectory(dataFolder);
                }
                filePath = Path.Combine(dataFolder, "resume.pdf");
            }
            else
            {
                // Local: Save to wwwroot and client/public
                var wwwRootPath = _webHostEnvironment.WebRootPath;
                if (string.IsNullOrEmpty(wwwRootPath))
                {
                    wwwRootPath = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                }

                if (!Directory.Exists(wwwRootPath))
                {
                    Directory.CreateDirectory(wwwRootPath);
                }

                filePath = Path.Combine(wwwRootPath, "resume.pdf");

                // Sync with client/public if the client folder exists
                var clientPublicDir = Path.Combine(_webHostEnvironment.ContentRootPath, "client", "public");
                if (Directory.Exists(clientPublicDir))
                {
                    var clientPublicFilePath = Path.Combine(clientPublicDir, "resume.pdf");
                    try
                    {
                        using (var stream = new FileStream(clientPublicFilePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Warning: Could not sync to client/public: {ex.Message}");
                    }
                }
            }

            // Write the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { message = "Resume uploaded and saved persistently.", path = "/resume.pdf" });
        }
    }
}

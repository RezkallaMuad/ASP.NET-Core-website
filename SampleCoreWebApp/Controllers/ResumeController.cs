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

            // Path to wwwroot/resume.pdf
            var wwwRootPath = _webHostEnvironment.WebRootPath;
            if (string.IsNullOrEmpty(wwwRootPath))
            {
                wwwRootPath = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
            }

            if (!Directory.Exists(wwwRootPath))
            {
                Directory.CreateDirectory(wwwRootPath);
            }

            var filePath = Path.Combine(wwwRootPath, "resume.pdf");

            // Write to wwwroot/resume.pdf
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Sync with client/public/resume.pdf if the client folder exists
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

            // Sync with client/build/resume.pdf if build folder exists
            var clientBuildDir = Path.Combine(_webHostEnvironment.ContentRootPath, "client", "build");
            if (Directory.Exists(clientBuildDir))
            {
                var clientBuildFilePath = Path.Combine(clientBuildDir, "resume.pdf");
                try
                {
                    using (var stream = new FileStream(clientBuildFilePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: Could not sync to client/build: {ex.Message}");
                }
            }

            return Ok(new { message = "Resume uploaded successfully.", path = "/resume.pdf" });
        }
    }
}

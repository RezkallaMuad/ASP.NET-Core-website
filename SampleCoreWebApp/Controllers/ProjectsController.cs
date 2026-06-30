using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SampleCoreWebApp.Data;
using SampleCoreWebApp.Models;
using SampleCoreWebApp.Filters;

namespace SampleCoreWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController(Dbcon context) : ControllerBase
    {
        private readonly Dbcon _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _context.Projects.OrderBy(p => p.DisplayOrder).ToListAsync();
            foreach (var p in projects)
            {
                if (!string.IsNullOrEmpty(p.MediaJson))
                {
                    try
                    {
                        p.Media = System.Text.Json.JsonSerializer.Deserialize<List<ProjectMedia>>(p.MediaJson);
                    }
                    catch (System.Text.Json.JsonException) { }
                }
                if (!string.IsNullOrEmpty(p.ContributorsJson))
                {
                    try
                    {
                        p.Contributors = System.Text.Json.JsonSerializer.Deserialize<List<string>>(p.ContributorsJson);
                    }
                    catch (System.Text.Json.JsonException) { }
                }
            }
            return projects;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(project.MediaJson))
            {
                try
                {
                    project.Media = System.Text.Json.JsonSerializer.Deserialize<List<ProjectMedia>>(project.MediaJson);
                }
                catch (System.Text.Json.JsonException) { }
            }
            if (!string.IsNullOrEmpty(project.ContributorsJson))
            {
                try
                {
                    project.Contributors = System.Text.Json.JsonSerializer.Deserialize<List<string>>(project.ContributorsJson);
                }
                catch (System.Text.Json.JsonException) { }
            }

            return project;
        }
        [HttpPost]
        [ApiKey]
        public async Task<ActionResult<Project>> AddProject(Project project)
        {
            if (project.Media != null)
            {
                project.MediaJson = System.Text.Json.JsonSerializer.Serialize(project.Media);
            }
            if (project.Contributors != null)
            {
                project.ContributorsJson = System.Text.Json.JsonSerializer.Serialize(project.Contributors);
            }
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        [ApiKey]
        public async Task<IActionResult> UpdateProject(int id, Project project)
        {
            if (id != project.Id)
            {
                return BadRequest();
            }

            if (project.Media != null)
            {
                project.MediaJson = System.Text.Json.JsonSerializer.Serialize(project.Media);
            }
            if (project.Contributors != null)
            {
                project.ContributorsJson = System.Text.Json.JsonSerializer.Serialize(project.Contributors);
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Projects.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ApiKey]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
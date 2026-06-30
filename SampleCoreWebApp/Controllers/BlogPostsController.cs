using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SampleCoreWebApp.Data;
using SampleCoreWebApp.Models;
using SampleCoreWebApp.Filters;

namespace SampleCoreWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogPostsController(Dbcon context) : ControllerBase
    {
        private readonly Dbcon _context = context;

        // GET: api/BlogPosts

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
        {
            return await _context.BlogPosts.OrderByDescending(static b => b.CreatedAt).ToListAsync();
        }

        // GET: api/BlogPosts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPost(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            return post ?? (ActionResult<BlogPost>)NotFound();
        }

        // POST: api/BlogPosts
        [HttpPost]
        [ApiKey]
        public async Task<ActionResult<BlogPost>> PostBlogPost(BlogPost blogPost)
        {
            blogPost.CreatedAt = DateTime.Now;
            _context.BlogPosts.Add(blogPost);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlogPost), new { id = blogPost.ID }, blogPost);
        }

        // PUT: api/BlogPosts/5
        [HttpPut("{id}")]
        [ApiKey]
        public async Task<IActionResult> PutBlogPost(int id, BlogPost blogPost)
        {
            if (id != blogPost.ID)
            {
                return BadRequest();
            }

            _context.Entry(blogPost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.BlogPosts.Any(e => e.ID == id))
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

        // DELETE: api/BlogPosts/5
        [HttpDelete("{id}")]
        [ApiKey]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

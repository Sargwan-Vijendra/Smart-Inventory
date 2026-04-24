using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartInventory.Data.Interfaces;
using static SmartInventory.Core.DTOs.CategoryDto;

namespace SmartInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController(ICategoryRepository repository) : ControllerBase
    {
        //[HttpGet]
        //public async Task<IActionResult> GetCategories()
        //{
        //    var result = await repository.GetAllAsync();
        //    return Ok(result);
        //}

        [HttpGet]
        public async Task<IActionResult> GetCategories([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            // Enforce minimums to prevent API abuse
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;

            var result = await repository.GetAllAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryCreateDto request)
        {
            try
            {
                var id = await repository.CreateAsync(request);
                return Ok(new { Id = id, Message = "Category created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await repository.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

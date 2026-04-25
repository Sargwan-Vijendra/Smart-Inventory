using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartInventory.Core.DTOs;
using SmartInventory.Data.Interfaces;

namespace SmartInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController(ISupplierRepository repository) : ControllerBase
    {
        //[HttpGet]
        //public async Task<IActionResult> GetAll() => Ok(await repository.GetAllAsync());

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            // Enforce minimums to prevent API abuse
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;

            var result = await repository.GetAllAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SupplierRequestDto request)
        {
            var id = await repository.CreateAsync(request);
            return Ok(new { Id = id, Message = "Supplier created successfully" });

            //return CreatedAtAction(nameof(GetAll), new { id }, request);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SupplierRequestDto request)
        {
            await repository.UpdateAsync(id, request);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await repository.DeleteAsync(id);
            return NoContent();
        }
    }
}

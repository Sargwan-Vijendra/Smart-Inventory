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
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await repository.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SupplierRequestDto request)
        {
            var id = await repository.CreateAsync(request);
            return CreatedAtAction(nameof(GetAll), new { id }, request);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SupplierRequestDto request)
        {
            await repository.UpdateAsync(id, request);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await repository.DeleteAsync(id);
            return NoContent();
        }
    }
}

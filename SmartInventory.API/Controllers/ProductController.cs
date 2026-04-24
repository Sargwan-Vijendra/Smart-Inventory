using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartInventory.Core.DTOs;
using SmartInventory.Core.Validators;
using SmartInventory.Data.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace SmartInventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductManagementRepository _Product;

        private readonly ProductCreateValidator _validator;

        private readonly ProductUpdateValidator _Updatevalidator;

        public ProductController(IProductManagementRepository product, ProductCreateValidator validator, ProductUpdateValidator updatevalidator)
        {
            _Product = product;
            _validator = validator;
            _Updatevalidator = updatevalidator;
        }

        [HttpGet("List")]
        public async Task<IActionResult> GetProducts(
         [FromQuery] string? search,
         [FromQuery] int? categoryId,
         [FromQuery] int? supplierId,
         [FromQuery] int pageNumber = 1,
         [FromQuery] int pageSize = 10)
        {
            var result = await _Product.GetProductsPaged(search, categoryId, supplierId, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("Detail/{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _Product.GetByProductId(id);

            if (product == null)
                return NotFound(new { message = $"Product with Id {id} not found." });

            return Ok(product);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto request)
        {
            // 1. Validate the Request
            var validationResult = await _validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
            }

            try
            {
                // 2. Execute Repository Logic
                int newProductId = await _Product.CreateProduct(request);

                // 3. Get the full details of the created product to return
                var createdProduct = await _Product.GetByProductId(newProductId);

                // 4. Return 201 Created with the location of the new resource
                return CreatedAtAction(nameof(GetProductById), new { id = newProductId }, createdProduct);
            }
            catch (Exception ex)
            {
                // In production, your Global Exception Middleware would catch this
                // but for now, we return a generic error if SKU is duplicate
                return BadRequest(new { message = "Could not create product. Ensure SKU is unique.", details = ex.Message });
            }
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateProduct([FromBody] ProductUpdateDto request)
        {
            // 1. Validate the Request
            var validationResult = await _Updatevalidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
            }

            try
            {
                // 2. Execute Repository Logic
                int newProductId = await _Product.UpdateProduct(request);

                // 3. Get the full details of the created product to return
                var updatedProduct = await _Product.GetByProductId(newProductId);

                // 4. Return 201 Created with the location of the new resource
                return CreatedAtAction(nameof(GetProductById), new { id = newProductId }, updatedProduct);
            }
            catch (Exception ex)
            {
                // In production, your Global Exception Middleware would catch this
                // but for now, we return a generic error if SKU is duplicate
                return BadRequest(new { message = "Could not create product. Ensure SKU is unique.", details = ex.Message });
            }
        }


        [HttpPut("Delete/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var isDeleted = await _Product.DeleteProduct(id);

                if (isDeleted)
                {
                    return Ok(new { message = "Product deleted successfully." });
                }
                else
                {
                    return NotFound(new { message = "Product not found." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Could not delete product.",
                    details = ex.Message
                });
            }
        }
    }
}

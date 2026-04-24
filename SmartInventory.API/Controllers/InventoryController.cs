using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SmartInventory.API.Hubs;
using SmartInventory.Data.Interfaces;
using static SmartInventory.Core.DTOs.InventoryDto;

namespace SmartInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController(IInventoryRepository repository, IHubContext<InventoryHub> hubContext) : ControllerBase
    {
        [HttpPatch("adjust")]
        public async Task<IActionResult> AdjustStock([FromBody] StockAdjustmentRequest request)
        {
            try
            {
                var result = await repository.AdjustStockAsync(request);

                // --- SIGNALR LOGIC ---
                if (result.IsLowStock)
                {
                    // We fetch the product name to make the alert more useful
                    // For production, you might return the Name directly from the sp_AdjustStock
                    await hubContext.Clients.All.SendAsync("ReceiveLowStockAlert", new
                    {
                        ProductId = request.ProductId,
                        Message = $"Low Stock Alert: Product ID {request.ProductId} is at {result.NewQuantity}!",
                        NewQuantity = result.NewQuantity
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("logs/{productId}")]
        public async Task<IActionResult> GetStockLogs(int productId)
        {
            var logs = await repository.GetLogsByProductIdAsync(productId);
            return Ok(logs);
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock()
        {
            var report = await repository.GetLowStockReportAsync();
            return Ok(report);
        }
    }


}

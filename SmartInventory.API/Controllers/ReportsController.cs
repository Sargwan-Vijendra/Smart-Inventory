using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartInventory.Core.DTOs;
using SmartInventory.Data.Interfaces;

namespace SmartInventory.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController(IReportRepository _reportRepository) : ControllerBase
    {
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardData()
        {
            try
            {
                var data = await _reportRepository.GetDashboardStatsAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("purchase-order/{supplierId}")]
        public async Task<IActionResult> GeneratePO(int supplierId, [FromServices] IPdfService pdfService)
        {
            // 1. Fetch data from Repository (Logic to get supplier items)
            // For this example, assume a method: repository.GetItemsToReorder(supplierId)
            var items = await _reportRepository.GetItemsToReorderAsync(supplierId);

            if (!items.Any()) return BadRequest("No low-stock items found for this supplier.");

            var firstItem = items.First();
            var poData = new PurchaseOrderDto(
                firstItem.SupplierName,
                firstItem.SupplierEmail,
                DateTime.Now,
                items.Select(i => new OrderItemDto(i.SKU, i.Name, i.CurrentQty, i.Threshold, i.Threshold * 2)).ToList()
            );

            // 2. Generate PDF
            var pdfBytes = pdfService.GeneratePurchaseOrderPdf(poData);

            // 3. Return as File Download
            return File(pdfBytes, "application/pdf", $"PO_{supplierId}_{DateTime.Now:yyyyMMdd}.pdf");
        }
    }



}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public record PurchaseOrderDto(
     string SupplierName,
     string SupplierEmail,
     DateTime OrderDate,
     List<OrderItemDto> Items
 );

    public record OrderItemDto(string SKU, string Name, int CurrentStock, int Threshold, int SuggestedOrderQty);

    public interface IPdfService
    {
        byte[] GeneratePurchaseOrderPdf(PurchaseOrderDto data);
    }
}

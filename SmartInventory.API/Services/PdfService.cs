using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Previewer; // Optional
using SmartInventory.Core.DTOs;

namespace SmartInventory.API.Services
{
    public class PdfService : IPdfService
    {
        public byte[] GeneratePurchaseOrderPdf(PurchaseOrderDto data)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);
                    page.Header().Text($"Purchase Order: {data.SupplierName}").FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

                    page.Content().Column(col =>
                    {
                        col.Item().Text($"Date: {data.OrderDate:yyyy-MM-dd}");
                        col.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.ConstantColumn(80);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("SKU");
                                header.Cell().Text("Product");
                                header.Cell().Text("Order Qty");
                            });

                            foreach (var item in data.Items)
                            {
                                table.Cell().Text(item.SKU);
                                table.Cell().Text(item.Name);
                                table.Cell().Text(item.SuggestedOrderQty.ToString());
                            }
                        });
                    });
                });
            }).GeneratePdf();
        }
    }
}

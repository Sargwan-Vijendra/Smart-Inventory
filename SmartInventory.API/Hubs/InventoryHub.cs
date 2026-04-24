using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;

namespace SmartInventory.API.Hubs
{
    public class InventoryHub : Hub
    {
        // This allows clients to join a specific group, e.g., "Admins"
        public async Task JoinAdminGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        }

        // A generic method to send a message to all connected clients
        public async Task SendLowStockAlert(string sku, string productName, int currentQuantity)
        {
            await Clients.Group("Admins").SendAsync("ReceiveLowStockAlert", new
            {
                SKU = sku,
                Name = productName,
                Quantity = currentQuantity,
                Timestamp = DateTime.Now
            });
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public class ProductDetailViewDto
    {
        public int Id { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Supplier { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal Price { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public class ProductUpdateDto
    {
        public int Id { get; set; } 
        public string SKU { get; set; }
        public string Name { get; set; }

        public decimal Price { get; set; }

        public int MinimumQty { get; set; }
    }
}

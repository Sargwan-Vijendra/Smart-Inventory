using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public  class ProductCreateDto
    {
        public string SKU { get; set; }
        public string Name { get; set; }

        public int CategoryId { get; set; }

        public int SupplyId { get; set; }

        public decimal Price { get; set; }

        public int MinimumQty { get; set; }

    }
}

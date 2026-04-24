using Microsoft.Data.SqlClient;
using SmartInventory.Core.DTOs;
using SmartInventory.Data.Interfaces;
using SmartInventory.Data.SqlHelpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Data.Repositories
{
    public class ReportRepository(DbConnectionFactory _connectionFactory) : IReportRepository
    {
        public async Task<IEnumerable<ReorderItemDto>> GetItemsToReorderAsync(int supplierId)
        {
            var items = new List<ReorderItemDto>();

            using var con = (SqlConnection)_connectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_GetSupplierReorderItems", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@SupplierId", supplierId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                items.Add(new ReorderItemDto(
                    reader["SupplierName"].ToString(),
                    reader["SupplierEmail"].ToString(),
                    reader["SKU"].ToString(),
                    reader["ProductName"].ToString(),
                    Convert.ToInt32(reader["CurrentQuantity"]),
                    Convert.ToInt32(reader["MinThreshold"])
                ));
            }

            return items;
        }
    }
}

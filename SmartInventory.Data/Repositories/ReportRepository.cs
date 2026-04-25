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

        public async Task<DashboardDto> GetDashboardStatsAsync()
        {
            var stats = new DashboardDto();

            using var con = (SqlConnection)_connectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_GetDashboardStats", con) { CommandType = CommandType.StoredProcedure };

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            // RESULT SET 1: Total Value & Low Stock Count
            if (await reader.ReadAsync())
            {
                stats.TotalStockValue = reader.GetDecimal(0);
                stats.LowStockCount = reader.GetInt32(1);
            }

            // RESULT SET 2: Top Moving Items
            if (await reader.NextResultAsync())
            {
                while (await reader.ReadAsync())
                {
                    stats.TopMovingItems.Add(new TopMovingItemDto(
                        reader.GetString(0),
                        reader.GetInt32(1)
                    ));
                }
            }

            // RESULT SET 3: Stock by Category
            if (await reader.NextResultAsync())
            {
                while (await reader.ReadAsync())
                {
                    stats.StockByCategory.Add(new CategoryStockDto(
                        reader.GetString(0),
                        reader.GetInt32(1)
                    ));
                }
            }

            return stats;
        }
    }
}

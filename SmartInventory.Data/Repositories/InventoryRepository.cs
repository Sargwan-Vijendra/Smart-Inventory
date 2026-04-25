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
using static SmartInventory.Core.DTOs.InventoryDto;

namespace SmartInventory.Data.Repositories
{
    public class InventoryRepository(DbConnectionFactory dbConnectionFactory) : IInventoryRepository 
    {
        public async Task<AdjustmentResponse> AdjustStockAsync(StockAdjustmentRequest request)
        {
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_AdjustStock", con) { CommandType = CommandType.StoredProcedure };

            cmd.Parameters.AddWithValue("@ProductId", request.ProductId);
            cmd.Parameters.AddWithValue("@QuantityChange", request.QuantityChange);
            cmd.Parameters.AddWithValue("@Type", request.Type);
            cmd.Parameters.AddWithValue("@Remarks", request.Remarks);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new AdjustmentResponse(
                    reader.GetBoolean(0),
                    reader.GetInt32(1),
                    reader.GetBoolean(2),
                    "Stock updated successfully."
                );
            }

            return new AdjustmentResponse(false, 0, false, "Failed to adjust stock.");
        }

        

        public async Task<IEnumerable<StockLogViewDto>> GetLogsByProductIdAsync(int productId)
        {
            var logs = new List<StockLogViewDto>();
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_GetStockLogs", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@ProductId", productId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                logs.Add(new StockLogViewDto(
                    reader.GetInt32(0),
                    reader.GetInt32(1),
                    reader.GetString(2),
                    reader.GetDateTime(3)
                ));
            }
            return logs;
        }

        //public async Task<IEnumerable<LowStockDto>> GetLowStockReportAsync()
        //{
        //    var report = new List<LowStockDto>();
        //    using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
        //    using var cmd = new SqlCommand("sp_GetLowStockReport", con) { CommandType = CommandType.StoredProcedure };

        //    await con.OpenAsync();
        //    using var reader = await cmd.ExecuteReaderAsync();
        //    while (await reader.ReadAsync())
        //    {
        //        report.Add(new LowStockDto(
        //            reader.GetInt32(0),
        //            reader.GetString(1),
        //            reader.GetString(2),
        //            reader.GetInt32(3),
        //            reader.GetInt32(4),
        //            reader.GetString(5)
        //        ));
        //    }
        //    return report;
        //}

        public async Task<LowStockDtoPagedResponseDto> GetLowStockReportAsync(int pageNumber, int pageSize)
        {
            var lowStocks = new List<LowStockDto>();
            int totalCount = 0;

            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_GetLowStockReport", con) { CommandType = CommandType.StoredProcedure };

            cmd.Parameters.AddWithValue("@PageNumber", pageNumber);
            cmd.Parameters.AddWithValue("@PageSize", pageSize);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            // Assume the SP returns two result sets: 1. The Data, 2. The Total Count
            while (await reader.ReadAsync())
            {
                lowStocks.Add(new LowStockDto(reader.GetInt32(0), reader.GetString(1), reader.GetString(2), reader.GetInt32(3), reader.GetInt32(4), reader.GetString(5)));
            }

            if (await reader.NextResultAsync() && await reader.ReadAsync())
            {
                totalCount = reader.GetInt32(0);
            }

            return new LowStockDtoPagedResponseDto(lowStocks, totalCount, pageNumber, pageSize);
        }

        
    }
}

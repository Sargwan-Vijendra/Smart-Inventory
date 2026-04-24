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
    public class SupplierRepository(DbConnectionFactory dbConnectionFactory) : ISupplierRepository
    {
        public async Task<IEnumerable<SupplierViewDto>> GetAllAsync()
        {
            var suppliers = new List<SupplierViewDto>();
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_GetSuppliers", con) { CommandType = CommandType.StoredProcedure };

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                suppliers.Add(new SupplierViewDto(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.IsDBNull(2) ? "" : reader.GetString(2),
                    reader.IsDBNull(3) ? "" : reader.GetString(3)
                ));
            }
            return suppliers;
        }

        public async Task<int> CreateAsync(SupplierRequestDto dto)
        {
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_CreateSupplier", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Name", dto.Name);
            cmd.Parameters.AddWithValue("@Email", dto.Email);
            cmd.Parameters.AddWithValue("@Phone", dto.Phone);

            await con.OpenAsync();
            return Convert.ToInt32(await cmd.ExecuteScalarAsync());
        }

        public async Task UpdateAsync(int id, SupplierRequestDto dto)
        {
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_UpdateSupplier", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@Name", dto.Name);
            cmd.Parameters.AddWithValue("@Email", dto.Email);
            cmd.Parameters.AddWithValue("@Phone", dto.Phone);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(int id)
        {
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            // Simple update query for soft delete
            using var cmd = new SqlCommand("UPDATE Suppliers SET IsDeleted = 1 WHERE Id = @Id", con);
            cmd.Parameters.AddWithValue("@Id", id);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
    }
}

using Microsoft.Data.SqlClient;
using SmartInventory.Data.Interfaces;
using SmartInventory.Data.SqlHelpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SmartInventory.Core.DTOs.CategoryDto;

namespace SmartInventory.Data.Repositories
{
    public class CategoryRepository(DbConnectionFactory dbConnectionFactory) : ICategoryRepository
    {
        //public async Task<IEnumerable<CategoryViewDto>> GetAllAsync()
        //{
        //    var categories = new List<CategoryViewDto>();
        //    using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
        //    using var cmd = new SqlCommand("sp_GetCategories", con) { CommandType = CommandType.StoredProcedure };

        //    await con.OpenAsync();
        //    using var reader = await cmd.ExecuteReaderAsync();
        //    while (await reader.ReadAsync())
        //    {
        //        categories.Add(new CategoryViewDto(reader.GetInt32(0), reader.GetString(1)));
        //    }
        //    return categories;
        //}

        public async Task<CategoryPagedResponseDto> GetAllAsync(int pageNumber, int pageSize)
        {
            var categories = new List<CategoryViewDto>();
            int totalCount = 0;

            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_GetCategories", con) { CommandType = CommandType.StoredProcedure };

            cmd.Parameters.AddWithValue("@PageNumber", pageNumber);
            cmd.Parameters.AddWithValue("@PageSize", pageSize);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            // Assume the SP returns two result sets: 1. The Data, 2. The Total Count
            while (await reader.ReadAsync())
            {
                categories.Add(new CategoryViewDto(reader.GetInt32(0), reader.GetString(1)));
            }

            if (await reader.NextResultAsync() && await reader.ReadAsync())
            {
                totalCount = reader.GetInt32(0);
            }

            return new CategoryPagedResponseDto(categories, totalCount, pageNumber, pageSize);
        }

        public async Task<int> CreateAsync(CategoryCreateDto dto)
        {
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_CreateCategory", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Name", dto.Name);

            await con.OpenAsync();
            return Convert.ToInt32(await cmd.ExecuteScalarAsync());
        }

        public async Task DeleteAsync(int id)
        {
            using var con = (SqlConnection)dbConnectionFactory.CreateConnection();
            using var cmd = new SqlCommand("sp_DeleteCategory", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Id", id);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
    }
}

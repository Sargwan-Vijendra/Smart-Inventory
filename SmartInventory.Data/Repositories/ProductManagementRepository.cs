using SmartInventory.Core.DTOs;
using SmartInventory.Data.Interfaces;
using SmartInventory.Data.SqlHelpers;
using System.Data;

namespace SmartInventory.Data.Repositories
{
    public class ProductManagementRepository : IProductManagementRepository
    {
        private readonly DbConnectionFactory _connectionFactory;

        public ProductManagementRepository(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<ProductDetailViewDto?> GetByProductId(int productId)
        {
            ProductDetailViewDto? product = null;

            using (IDbConnection con = _connectionFactory.CreateConnection())
            {
                using (IDbCommand cmd = con.CreateCommand())
                {
                    cmd.CommandText = "SpGetProductById";
                    cmd.CommandType = CommandType.StoredProcedure;

                    IDbDataParameter param = cmd.CreateParameter();
                    param.ParameterName = "@ProductId";
                    param.Value = productId;
                    cmd.Parameters.Add(param);

                    if (con.State != ConnectionState.Open)
                        con.Open();

                    using (IDataReader reader = await Task.Run(() => cmd.ExecuteReader()))
                    {
                        if (reader.Read())
                        {
                            product = new ProductDetailViewDto
                            {
                                Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                                SKU = reader["SKU"] != DBNull.Value ? reader["SKU"].ToString() : null,
                                Name = reader["Name"] != DBNull.Value ? reader["Name"].ToString() : null,
                                Category = reader["Category"] != DBNull.Value ? reader["Category"].ToString() : null,
                                Supplier = reader["Supplier"] != DBNull.Value ? reader["Supplier"].ToString() : null,
                                Quantity = reader["Quantity"] != DBNull.Value ? Convert.ToInt32(reader["Quantity"]) : 0,
                                Price = reader["Price"] != DBNull.Value ? Convert.ToDecimal(reader["Price"]) : 0,
                            };
                        }
                    }
                }
            }

            return product;
        }


        public async Task<int> CreateProduct(ProductCreateDto dto)
        {
            using var con = _connectionFactory.CreateConnection();
            using var cmd = con.CreateCommand();

            cmd.CommandText = "sp_CreateProduct"; // The Stored Proc we discussed earlier
            cmd.CommandType = CommandType.StoredProcedure;

            // Mapping DTO to Parameters
            AddParameter(cmd, "@SKU", dto.SKU);
            AddParameter(cmd, "@Name", dto.Name);
            AddParameter(cmd, "@CategoryId", dto.CategoryId);
            AddParameter(cmd, "@SupplierId", dto.SupplyId);
            AddParameter(cmd, "@Price", dto.Price);
            AddParameter(cmd, "@MinQty", dto.MinimumQty);
            AddParameter(cmd, "@InitialQty", 0); // Defaulting initial stock to 0

            if (con.State != ConnectionState.Open) con.Open();

            // ExecuteScalar returns the SCOPE_IDENTITY() from the Stored Procedure
            var result = await Task.Run(() => cmd.ExecuteScalar());
            return Convert.ToInt32(result);
        }

        public async Task<int> UpdateProduct(ProductUpdateDto dto)
        {
            using var con = _connectionFactory.CreateConnection();
            using var cmd = con.CreateCommand();

            cmd.CommandText = "sp_UpdateProduct";
            cmd.CommandType = CommandType.StoredProcedure;

            // Mapping DTO to Parameters
            AddParameter(cmd, "@Id", dto.Id); // Crucial: Add the ID parameter
            AddParameter(cmd, "@SKU", dto.SKU);
            AddParameter(cmd, "@Name", dto.Name);
            AddParameter(cmd, "@Price", dto.Price);
            AddParameter(cmd, "@MinQty", dto.MinimumQty);

            if (con.State != ConnectionState.Open) con.Open();

            // ExecuteScalar will return the @Id we selected at the end of the stored proc
            var result = await Task.Run(() => cmd.ExecuteScalar());
            return Convert.ToInt32(result);
        }

        public async Task<bool> DeleteProduct(int id)
        {
            using var con = _connectionFactory.CreateConnection();
            using var cmd = con.CreateCommand();

            cmd.CommandText = "UPDATE Products SET IsDeleted = 1 WHERE Id = @Id";

            AddParameter(cmd, "@Id", id);

            if (con.State != ConnectionState.Open)
                con.Open();

            var result = await Task.Run(() => cmd.ExecuteNonQuery());

            return result > 0;
        }


        public async Task<PagedResponse<ProductDetailViewDto>> GetProductsPaged(string? search, int? categoryId, int? supplierId, int pageNumber, int pageSize)
        {
            var response = new PagedResponse<ProductDetailViewDto>
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var items = new List<ProductDetailViewDto>();
            int totalCount = 0;

            using var con = _connectionFactory.CreateConnection();
            using var cmd = con.CreateCommand();
            cmd.CommandText = "sp_GetProductsPaged";
            cmd.CommandType = CommandType.StoredProcedure;

            AddParameter(cmd, "@SearchTerm", (object?)search ?? DBNull.Value);
            AddParameter(cmd, "@CategoryId", (object?)categoryId ?? DBNull.Value);
            AddParameter(cmd, "@SupplierId", (object?)supplierId ?? DBNull.Value);
            AddParameter(cmd, "@PageNumber", pageNumber);
            AddParameter(cmd, "@PageSize", pageSize);

            if (con.State != ConnectionState.Open) con.Open();

            using (var reader = await Task.Run(() => cmd.ExecuteReader()))
            {
                while (reader.Read())
                {
                    if (totalCount == 0) totalCount = Convert.ToInt32(reader["TotalCount"]);

                    items.Add(new ProductDetailViewDto
                    {
                        Id = Convert.ToInt32(reader["Id"]),
                        SKU = reader["SKU"].ToString(),
                        Name = reader["Name"].ToString(),
                        Category = reader["Category"].ToString(),
                        Supplier = reader["Supplier"].ToString(),
                        Price = Convert.ToDecimal(reader["Price"]),
                        Quantity = Convert.ToInt32(reader["Quantity"])
                    });
                }
            }

            response.Items = items;
            response.TotalCount = totalCount;
            return response;
        }

        // Helper method to keep code clean
        private void AddParameter(IDbCommand cmd, string name, object value)
        {
            var param = cmd.CreateParameter();
            param.ParameterName = name;
            param.Value = value ?? DBNull.Value;
            cmd.Parameters.Add(param);
        }
    }
}
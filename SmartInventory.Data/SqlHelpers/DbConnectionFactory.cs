using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace SmartInventory.Data.SqlHelpers;

// Used Primary Constructor () to inject IConfiguration directly
public class DbConnectionFactory(IConfiguration configuration)
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found in appsettings.json");

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
}
using Microsoft.Data.SqlClient;
using SmartInventory.Core.Entities;
using SmartInventory.Data.Interfaces;
using SmartInventory.Data.SqlHelpers;
using System.Data;
using System.Data.Common; // ADD THIS for DbConnection support

namespace SmartInventory.Data.Repositories
{
    public class UserRepository(DbConnectionFactory dbConnectionFactory) : IUserRepository
    {
        public async Task<User?> GetByUsernameAsync(string username)
        {
            // CAST the connection to DbConnection to enable OpenAsync()
            using var connection = (DbConnection)dbConnectionFactory.CreateConnection();

            using var command = new SqlCommand("SELECT Id, Username, PasswordHash, Role FROM Users WHERE Username = @Username", (SqlConnection)connection);
            command.Parameters.AddWithValue("@Username", username);

            await connection.OpenAsync(); // Now this works!
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    PasswordHash = reader.GetString(2),
                    Role = reader.GetString(3)
                };
            }
            return null;
        }

        public async Task<int> CreateUserAsync(User user)
        {
            // CAST the connection here as well
            using var connection = (DbConnection)dbConnectionFactory.CreateConnection();

            using var command = new SqlCommand(
                "INSERT INTO Users (Username, PasswordHash, Role) VALUES (@Username, @Hash, @Role); SELECT SCOPE_IDENTITY();",
                (SqlConnection)connection);

            command.Parameters.AddWithValue("@Username", user.Username);
            command.Parameters.AddWithValue("@Hash", user.PasswordHash);
            command.Parameters.AddWithValue("@Role", user.Role);

            await connection.OpenAsync(); // Now this works!
            return Convert.ToInt32(await command.ExecuteScalarAsync());
        }
    }
}
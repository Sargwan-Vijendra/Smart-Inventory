using SmartInventory.Core.DTOs;
using System.Net;
using System.Text.Json;

namespace SmartInventory.API.Middleware
{
    public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";

                // Default to 500 Internal Server Error
                var statusCode = (int)HttpStatusCode.InternalServerError;
                var message = "An unexpected error occurred on the server.";

                // Specific handling for business logic/safety errors
                if (ex.Message.Contains("Insufficient stock") || ex.Message.Contains("linked to active products"))
                {
                    statusCode = (int)HttpStatusCode.BadRequest;
                    message = ex.Message;
                }

                context.Response.StatusCode = statusCode;

                var response = new ErrorResponse
                {
                    StatusCode = statusCode,
                    Message = message,
                    Details = env.IsDevelopment() ? ex.StackTrace?.ToString() : null
                };

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}

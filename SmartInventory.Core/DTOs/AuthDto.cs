using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public class AuthDto
    {
        public record LoginRequest(string Username, string Password);
        public record RegisterRequest(string Username, string Password, string Role);
        public record AuthResponse(bool Success, string Token, string Message, string Role = "");
        public record UserProfileResponse(int Id, string Username, string Role);
    }
}

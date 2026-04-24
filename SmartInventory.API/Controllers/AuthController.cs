using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartInventory.API.Services;
using SmartInventory.Core.Entities;
using SmartInventory.Data.Interfaces;
using static SmartInventory.Core.DTOs.AuthDto;
// ADD THIS LINE BELOW
using BC = BCrypt.Net.BCrypt;

namespace SmartInventory.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IUserRepository userRepository, TokenService tokenService) : ControllerBase
    {

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await userRepository.GetByUsernameAsync(request.Username);

            // BC is now recognized because of the alias at the top
            if (user == null || !BC.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new AuthResponse(false, "", "Invalid username or password"));

            string token = tokenService.CreateToken(user);
            return Ok(new AuthResponse(true, token, "Login Successful", user.Role));
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existingUser = await userRepository.GetByUsernameAsync(request.Username);
            if (existingUser != null) return BadRequest("Username already exists");

            var newUser = new User
            {
                Username = request.Username,
                PasswordHash = BC.HashPassword(request.Password),
                Role = request.Role
            };

            await userRepository.CreateUserAsync(newUser);
            return Ok("User registered successfully");
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMe()
        {
            var userName = User.Identity?.Name;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            return Ok(new { userId, userName, role });
        }
    }
}
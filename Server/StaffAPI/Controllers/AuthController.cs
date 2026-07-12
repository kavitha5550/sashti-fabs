using Microsoft.AspNetCore.Mvc;
using adminLoginAPI.modules;

namespace StaffAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] adminLogin request)
    {
        // Validate input
        if (string.IsNullOrEmpty(request.email) || string.IsNullOrEmpty(request.password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        // Simple authentication (replace with actual database validation later)
        // For now, accept any non-empty email/password
        if (request.email == "admin@example.com" && request.password == "admin123")
        {
            return Ok(new 
            { 
                message = "Login successful", 
                token = "dummy_jwt_token_" + Guid.NewGuid().ToString(),
                user = new { email = request.email }
            });
        }

        return Unauthorized(new { message = "Invalid email or password" });
    }
}

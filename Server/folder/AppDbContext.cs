using Microsoft.EntityFrameworkCore;
using adminLogin.module;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? 
                       builder.Configuration.GetSection("ConnectionString:defaultConnection").Value;

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAngular");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Seed Default Admin Login Data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated(); // Automatically generates schema in MySQL
    
    if (!dbContext.AdminLogins.Any(u => u.email == "admin@gmail.com"))
    {
        dbContext.AdminLogins.Add(new adminLogin
        {
            email = "admin@gmail.com",
            password = "admin"
        });
        dbContext.SaveChanges();
    }
}

// POST endpoint for Login
app.MapPost("/api/auth/login", async (adminLogin loginRequest, AppDbContext dbContext) =>
{
    if (string.IsNullOrEmpty(loginRequest.email) || string.IsNullOrEmpty(loginRequest.password))
    {
        return Results.BadRequest(new { message = "Email and password are required." });
    }

    var user = await dbContext.AdminLogins
        .FirstOrDefaultAsync(u => u.email == loginRequest.email && u.password == loginRequest.password);

    if (user == null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new { message = "Login successful", email = user.email });
})
.WithName("AdminLogin")
.WithOpenApi();

app.Run();
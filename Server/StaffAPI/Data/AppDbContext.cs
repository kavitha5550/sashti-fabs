using Microsoft.EntityFrameworkCore;
using StaffAPI.Models;

namespace StaffAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; } = null!;
}

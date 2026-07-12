using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StaffAPI.Data;
using StaffAPI.Models;

namespace StaffAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public EmployeesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetAll()
    {
        var employees = await _dbContext.Employees.OrderByDescending(e => e.CreatedAt).ToListAsync();
        return Ok(employees);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Employee>> GetById(int id)
    {
        var employee = await _dbContext.Employees.FindAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = $"Employee with ID {id} not found." });
        }
        return Ok(employee);
    }

    [HttpPost]
    public async Task<ActionResult<Employee>> Add([FromBody] Employee employee)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        employee.CreatedAt = DateTime.UtcNow;
        _dbContext.Employees.Add(employee);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Employee>> Update(int id, [FromBody] Employee updatedEmployee)
    {
        if (id != updatedEmployee.Id && updatedEmployee.Id != 0)
        {
            return BadRequest(new { message = "Employee ID in payload must match the ID in the URL." });
        }

        var existing = await _dbContext.Employees.FindAsync(id);
        if (existing == null)
        {
            return NotFound(new { message = $"Employee with ID {id} not found." });
        }

        existing.Name = updatedEmployee.Name;
        existing.Email = updatedEmployee.Email;
        existing.DateOfBirth = updatedEmployee.DateOfBirth;
        existing.Gender = updatedEmployee.Gender;
        existing.Phone = updatedEmployee.Phone;
        existing.Address = updatedEmployee.Address;
        existing.Qualification = updatedEmployee.Qualification;

        await _dbContext.SaveChangesAsync();

        return Ok(existing);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var existing = await _dbContext.Employees.FindAsync(id);
        if (existing == null)
        {
            return NotFound(new { message = $"Employee with ID {id} not found." });
        }

        _dbContext.Employees.Remove(existing);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}

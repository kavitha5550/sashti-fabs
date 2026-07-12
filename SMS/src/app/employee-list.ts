import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading = false;

  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        console.log('Employees:', employees);
        this.employees = employees;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/dashboard/add']);
  }

  navigateToDetail(employee: Employee): void {
    this.router.navigate(['/dashboard/employees', employee.id]);
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/dashboard/employees', employee.id, 'edit']);
  }

  deleteEmployee(employee: Employee): void {
    if (!employee.id) {
      return;
    }

    const confirmed = window.confirm(`Delete ${employee.name}? This will remove the record permanently.`);
    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => this.loadEmployees(),
      error: () => this.loadEmployees()
    });
  }
}

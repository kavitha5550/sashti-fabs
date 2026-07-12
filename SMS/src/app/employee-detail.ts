import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from './employee.service';
import { NotificationService } from './notification.service';
import { Employee } from './employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.html'
})
export class EmployeeDetailComponent implements OnInit {
  employee?: Employee;
  isLoading = false;
  notificationId?: number;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.notificationId = Number(this.route.snapshot.queryParamMap.get('notificationId')) || undefined;
    if (!id) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.isLoading = false;
        if (this.notificationId) {
          this.notificationService.markRead(this.notificationId);
        }
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  editEmployee(): void {
    if (!this.employee?.id) {
      return;
    }
    this.router.navigate(['/dashboard/employees', this.employee.id, 'edit']);
  }

  deleteEmployee(): void {
    if (!this.employee?.id) {
      return;
    }

    const confirmed = window.confirm(`Delete employee ${this.employee.name}?`);
    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        window.alert('Unable to delete the employee. Please try again.');
      }
    });
  }
}

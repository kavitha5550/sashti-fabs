import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from './employee.service';
import { NotificationService } from './notification.service';
import { Employee } from './employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './employee-form.html'
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  formTitle = 'Add New Employee';
  formMode: 'add' | 'edit' = 'add';
  employeeId?: number;
  isSaving = false;
  qualificationOptions = ['BE', 'BSc', 'BCom', 'BA', 'BCA', 'MCA', 'ME', 'MSc'];

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      dateOfBirth: ['', Validators.required],
      gender: ['Male', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(400)]],
      qualification: ['BE', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formMode = 'edit';
      this.employeeId = Number(id);
      this.formTitle = 'Edit Employee Details';
      this.loadEmployee(this.employeeId);
    }
  }

  private loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          dateOfBirth: employee.dateOfBirth,
          gender: employee.gender,
          phone: employee.phone,
          address: employee.address,
          qualification: employee.qualification
        });
      },
      error: () => {
        this.snackBar.open('Unable to load employee details.', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  get control() {
    return this.employeeForm.controls;
  }

  resetForm(): void {
    this.employeeForm.reset({
      gender: 'Male',
      qualification: 'BE'
    });
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid || this.isSaving) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const employee: Employee = this.employeeForm.value;

    if (this.formMode === 'add') {
      this.employeeService.addEmployee(employee).subscribe({
        next: (createdEmployee) => {
          this.notificationService.addNotification(createdEmployee);
          this.snackBar.open('New employee added successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/employees', createdEmployee.id]);
          this.isSaving = false;
        },
        error: () => {
          this.snackBar.open('Failed to add employee. Please try again.', 'Close', { duration: 3000 });
          this.isSaving = false;
        }
      });
      return;
    }

    if (!this.employeeId) {
      this.isSaving = false;
      return;
    }

    this.employeeService.updateEmployee(this.employeeId, employee).subscribe({
      next: (updatedEmployee) => {
        this.snackBar.open('Employee updated successfully.', 'Close', { duration: 3000 });
       this.router.navigate(['/dashboard']);
        this.isSaving = false;
      },
      error: () => {
        this.snackBar.open('Failed to update employee. Please try again.', 'Close', { duration: 3000 });
        this.isSaving = false;
      }
    });
  }
}

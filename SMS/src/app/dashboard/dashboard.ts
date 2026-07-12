import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  notifications$ = this.notificationService.notifications$;
  showNotifications = false;

  logout(): void {
    this.router.navigate(['/']);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  openNotification(employeeId: number, notificationId: number): void {
    this.notificationService.markRead(notificationId);
    this.router.navigate(['/dashboard/employees', employeeId], {
      queryParams: { notificationId }
    });
    this.showNotifications = false;
  }
}
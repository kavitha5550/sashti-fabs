import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationItem, Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationItem[]>([]);
  notifications$: Observable<NotificationItem[]> = this.notificationSubject.asObservable();

  addNotification(employee: Employee): void {
    const current = this.notificationSubject.value;
    const next: NotificationItem = {
      id: Date.now(),
      title: 'New employee added',
      message: `Employee ${employee.name} was added successfully.`,
      employeeId: employee.id ?? 0,
      createdAt: new Date().toISOString(),
      read: false
    };
    this.notificationSubject.next([next, ...current]);
  }

  markRead(notificationId: number): void {
    const updated = this.notificationSubject.value.map((item) =>
      item.id === notificationId ? { ...item, read: true } : item
    );
    this.notificationSubject.next(updated);
  }

  clearNotification(notificationId: number): void {
    const updated = this.notificationSubject.value.filter((item) => item.id !== notificationId);
    this.notificationSubject.next(updated);
  }
}

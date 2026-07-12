export interface Employee {
  id?: number;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  qualification: string;
  createdAt?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  employeeId: number;
  createdAt: string;
  read: boolean;
}

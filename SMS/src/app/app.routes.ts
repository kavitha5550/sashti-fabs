import { Routes } from '@angular/router';
import { App } from './app';
import { DashboardComponent } from './dashboard/dashboard';
import { EmployeeListComponent } from './employee-list';
import { EmployeeFormComponent } from './employee-form';
import { EmployeeDetailComponent } from './employee-detail';

export const routes: Routes = [
  { path: '', component: App, pathMatch: 'full' },
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, 
    children: [
    { path: '', component: EmployeeListComponent },
    { path: 'add', component: EmployeeFormComponent },
    { path: 'employees/:id/edit', component: EmployeeFormComponent },
    { path: 'employees/:id', component: EmployeeDetailComponent }
  ] }
];

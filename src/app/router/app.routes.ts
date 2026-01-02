import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { ApiDocumentation } from '../pages/api-documentation/api-documentation';
import { SetupGuide } from '../pages/setup-guide/setup-guide';
import { AdminComponent } from '../pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'docs', component: ApiDocumentation },
  { path: 'setup', component: SetupGuide },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];

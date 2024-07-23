import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { ClientListComponent } from './client/components/client-list/client-list.component';
import { ClientDetailsComponent } from './client/components/client-details/client-details.component';
import { ClientFormComponent } from './client/components/client-form/client-form.component';

export const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'clients',
    component: ClientListComponent,
  },
  {
    path: 'clients/add',
    component: ClientFormComponent,
  },
  {
    path: 'clients/:id',
    component: ClientDetailsComponent,
  },
  {
    path: 'clients/edit/:id',
    component: ClientFormComponent,
  },
];

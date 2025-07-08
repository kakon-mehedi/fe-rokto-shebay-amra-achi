import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DonorLoginComponent } from './components/donor-login/donor-login.component';
import { DonorRegisterComponent } from './components/donor-register/donor-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "login"
  },

  // Regular user routes
  {
    path: "login",
    pathMatch: "full",
    component: LoginComponent,
    data: { title: 'ব্যবহারকারী লগইন' },
  },

  {
    path: "register",
    pathMatch: "full",
    component: SignUpComponent,
    data: { title: 'ব্যবহারকারী নিবন্ধন' },
  },

  // Donor routes
  {
    path: "donor-login",
    pathMatch: "full",
    component: DonorLoginComponent,
    data: { title: 'দাতা লগইন' },
  },

  {
    path: "donor-register",
    pathMatch: "full",
    component: DonorRegisterComponent,
    data: { title: 'দাতা নিবন্ধন' },
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    DonorLoginComponent,
    DonorRegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }

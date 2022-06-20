import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/modules/material/material.module';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';

const routes = [
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'confirm/:token', component: EmailConfirmationComponent },
];

@NgModule({
  declarations: [SignUpComponent, SignInComponent, EmailConfirmationComponent],

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class AuthModule {}

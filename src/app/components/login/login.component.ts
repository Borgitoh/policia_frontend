import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    this.router.navigate(['/home']);
    console.log(333);

    if (this.loginForm.valid) {
      console.log('Form Submitted:', this.loginForm.value);
    } else {
      console.error('Form is invalid');
    }
  }

}

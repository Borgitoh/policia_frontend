import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/service/usuario-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
              private router: Router,
            private usuarioService: UsuarioService) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  getUser() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Preencha todos os campos';
      return;
    }

    const { login, password } = this.loginForm.value;

    this.usuarioService.getUserByLogin(login).subscribe((users: any[]) => {
      if (users.length > 0 && users[0].password === password) {
        this.usuarioService.setUser(users[0])
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Login ou senha inválidos';
      }
    }, error => {
      this.errorMessage = 'Erro ao conectar ao servidor';
      console.error(error);
    });
  }
  
  onSubmit() {
    this.getUser();
  }

}

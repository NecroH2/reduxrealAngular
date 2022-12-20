import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm:any;
  
  constructor(private fb:FormBuilder,
              private authService:AuthService,
              private router:Router){

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  login(){

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading(null)
      }
    })

    if (this.loginForm.invalid) {return ;}

    const { correo, password } = this.loginForm.value;

    this.authService.loginUsuario(correo, password)
    .then(credenciales => {
      console.log(credenciales);
      Swal.close();
      this.router.navigate(['/'])
    })
    .catch(err => {
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
     })
    });
  }

}

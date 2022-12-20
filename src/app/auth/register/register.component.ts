import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  registroForm:any;

  constructor(private fb:FormBuilder,
              private authService: AuthService,
              private router:Router){}

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
    
  }

  crearUsuario(){

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading(null)
      }
    })

    if (this.registroForm.invalid) {return ;}

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsiario(nombre, correo, password)
    .then(credenciales => {
      console.log(credenciales);
      Swal.close();
      this.router.navigate(['/'])
    })
    .catch(err =>{
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
     })
    });

  }

  loading() {

  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit ,OnDestroy{

  loginForm:any;
  cargando:boolean = false;
  uiSubcription:Subscription = new Subscription;
  
  constructor(private fb:FormBuilder,
              private authService:AuthService,
              private store:Store<AppState>,
              private router:Router){

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubcription =  this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    });
  }

  ngOnDestroy(): void {
    this.uiSubcription.unsubscribe();
  }

  login(){

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    if (this.loginForm.invalid) {return ;}

    this.store.dispatch(ui.isLoading());

    const { correo, password } = this.loginForm.value;

    this.authService.loginUsuario(correo, password)
    .then(credenciales => {
      console.log(credenciales);
      // Swal.close();
      this.store.dispatch(ui.stopLoading())
      this.router.navigate(['/'])
    })
    .catch(err => {
      this.store.dispatch(ui.stopLoading())
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
     })
    });
  }

}

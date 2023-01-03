import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy {

  registroForm:any;
  cargando:boolean = false;
  uiSubcription:Subscription = new Subscription;
  

  constructor(private fb:FormBuilder,
              private authService: AuthService,
              private store:Store<AppState>,
              private router:Router){}

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })

    this.uiSubcription =  this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    });
    
  }

  
  ngOnDestroy(): void {
    this.uiSubcription.unsubscribe();
  }

  crearUsuario(){

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    if (this.registroForm.invalid) {return ;}

    this.store.dispatch(ui.isLoading());

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsiario(nombre, correo, password)
    .then(credenciales => {
      console.log(credenciales);
      this.store.dispatch(ui.stopLoading())
      // Swal.close();
      this.router.navigate(['/'])
    })
    .catch(err =>{
      this.store.dispatch(ui.stopLoading())
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

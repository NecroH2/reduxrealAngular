import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth:AngularFireAuth,
               public firestore : AngularFirestore) { }

  iniAuthListener(){

    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
    });

  }

  crearUsiario(nombre:string,email:string,password:string){
    

    console.log(nombre,email,password);
    return this.auth.createUserWithEmailAndPassword(email,password)
    .then ( fbuser  => {

      const newUser = new Usuario(fbuser.user?.uid, email, fbuser.user?.email)

      return this.firestore.doc(` ${fbuser.user?.uid}/usuario `) 
      .set({...newUser});

    });
  }

  loginUsuario(email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fbUser=> fbUser != null )
    );
  }

}

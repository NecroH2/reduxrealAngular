import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor( public auth:AngularFireAuth,
               public firestore : AngularFirestore,
               private store:Store<AppState>) { }

  iniAuthListener(){

    this.auth.authState.subscribe(fuser => {
      if(fuser){
        //this.store.dispatch(setUser({}));
        this.userSubscription = this.firestore.doc(`/ ${fuser.uid}/usuario `).valueChanges()
        .subscribe((fsotre : any) => {
          const user  =  Usuario.fromFirebase(fsotre)
          this.store.dispatch(setUser({user}));
        })
      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(unSetUser());
      }
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

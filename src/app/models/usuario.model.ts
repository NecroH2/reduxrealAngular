export class Usuario {

    static fromFirebase({email, uid, nombre}) {
        return new Usuario(uid, nombre, email)
    }

    constructor (
            public uid:string | any,
            public nombre:string | any,
            public email:string | any
        ){

    }

}
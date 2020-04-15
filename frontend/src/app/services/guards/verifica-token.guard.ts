import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router) {}

  canActivate(): Promise<boolean> | boolean {

    const token  = this.usuarioService.token;
    const payload = jwt_decode(token);
    const expirado = this.expirado( payload.exp );

    //Si el token esta expuirado el usuario no puede entrar
    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificarRenovacion( payload.exp );
  }

  verificarRenovacion( fechaExp: number ): Promise<boolean> {

    return new Promise( (resolve, reject) => {

      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 4 * 60 * 60 * 1000));

      //console.log(tokenExp);
      //console.log(ahora);

      //Si la fecha de expiracion del token 
      //es mayor a las 4 horas que le estoy dando adicional entonces no puede renovar
      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(false);
      }else {

        this.usuarioService.renuevaToken()
        .subscribe( () => {
          resolve(true);
        }, () => {
          reject(false);
          this.router.navigate(['/login']);
        });
      }

    });
  }

  expirado( fechaExp: number ) {

    const ahora = new Date().getTime() / 1000; //Entre 1000 por que esta en milisegundo

    if ( fechaExp < ahora ) {
      return true; //Esto quiere decir que si esta expirado
    }else {
      return false;
    }
  }

}

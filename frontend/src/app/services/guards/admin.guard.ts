import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService) {}

  canActivate() {

    if ( this.usuarioService.usuario.role === 'ADMIN') {
      return true;
    }else{
      console.log('Bloqueado por el Admin Guard');
      this.usuarioService.logout();
      return false;
    }

  }

}

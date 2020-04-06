import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICES } from '../../config/config';
//import  { wal } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: any;
  token: string;

  constructor(public http: HttpClient, public router: Router ) {}

  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, remember: boolean = false){

    if (remember) {
      localStorage.setItem('email', usuario.email);
    }else{
      localStorage.removeItem('email');
    }


    const url = URL_SERVICES + '/users/login';
    return this.http.post(url, usuario)
    .map((resp:any) => {
      localStorage.setItem('id', resp.id);
      localStorage.setItem('token', resp.token);
      localStorage.setItem('usuario', JSON.stringify(resp.usuario));

      return true;
    });
  }

  crearUsuario(usuario: Usuario){
    const url = URL_SERVICES + '/users';
    return this.http.post( url, usuario)
    .map((resp: any) => {
      //swal('User Created', usuario.email, 'success');
      return resp.usuario;
    });
  }
}

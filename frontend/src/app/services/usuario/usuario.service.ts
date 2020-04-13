import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICES } from '../../config/config';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

import swal from 'sweetalert2';
import { UploadFilesService } from '../upload/upload-files.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient, 
    public router: Router,
    public upload: UploadFilesService ) {
    this.cargarStorage();
  }

  estaLogeado(){
    return(this.token.length > 5 ) ? true : false;
  }

  //Esta funcion sirve para cargar el storage siempre que el servicio se inicialize
  cargarStorage(){

    if (localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario){

      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      this.usuario = usuario;
      this.token = token;
  }

  loginGoogle(token: string){

    const url = URL_SERVICES + '/users/google';

    return this.http.post(url, { token })
           .map((resp: any) => {
             this.guardarStorage(resp.id, resp.token, resp.usuario);
             return true;
           });
  }

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
    .map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    });
  }

  crearUsuario(usuario: Usuario){
    const url = URL_SERVICES + '/users';
    return this.http.post( url, usuario)
    .map((resp: any) => {
      swal.fire('User Created', usuario.email, 'success');
      return resp.usuario;
    });
  }

  actualizarUsuario(usuario: Usuario){
    let url = URL_SERVICES + '/users/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
          .map( (resp: any) => {
            //Este se refiere al usuario logeado this.usuario._id
            if ( usuario._id === this.usuario._id ) {
              const usuarioDB: Usuario = resp.usuario;
              this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
            }

            swal.fire('Updated user', usuario.name, 'success');

            return true;
    });
  }

  cambiarImagen( archivo: File, id: string ){
    this.upload.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) => {
        this.usuario.img = this.usuario.img;
        swal.fire('Updated image', this.usuario.name, 'success');
        this.guardarStorage(id, this.token, this.usuario);
      })
      .catch( resp => {
        console.log(resp);
      });
    }

    cargarUsuarios( desde: number = 0 ) {
      const url = URL_SERVICES + '/users?desde=' + desde;
      return this.http.get( url );
    }

    buscarUsuarios( termino: string ) {
      const url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + termino;
      return this.http.get( url )
              .map( (resp: any) => resp.usuarios);
    }

    borrarUsuario(id: string) {
      let url = URL_SERVICES + '/users/' + id;
      url += '?token=' + this.token;
      return this.http.delete(url)
      .map( resp => {
        swal.fire('Deleted user', 'User was successfully removed', 'success');
        return true;
      });
    }

  }

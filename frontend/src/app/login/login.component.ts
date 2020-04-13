import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';
import { element } from 'protractor';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css'],
})
export class LoginComponent implements OnInit {

  email: string;
  remember: boolean = false;
  auth2: any;

  constructor(public router: Router, public usuarioService: UsuarioService) { }

  ngOnInit(): void {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1){
      this.remember = true;
    }
  }

  googleInit(){
    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '734257713342-th18hb3eoerbpq2naolclnloior9no2c.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email',
        //ux_mode: 'redirect'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  // tslint:disable-next-line: no-shadowed-variable
  attachSignin( element ){
    this.auth2.attachClickHandler( element, {}, (googleUser) => { 
      //var profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      // tslint:disable-next-line:comment-format
      //console.log(profile);
      this.usuarioService.loginGoogle(token)
      .subscribe( () => window.location.href = '/dashboard');
    });
  }

  ingresar(forma: NgForm){

    if (forma.invalid){
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this.usuarioService.login(usuario, forma.value.remember)
    .subscribe(correcto => this.router.navigate(['/dashboard']));
  }

  }

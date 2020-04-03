import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import * as swal from 'sweetalert';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './login.component.css'],
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  sonIguales(campo1: string, campo2: string) {

    return(group: FormGroup) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2){
        return null;
      }

      return {
        sonIguales: true
      };
    // tslint:disable-next-line: semicolon
    }
  }

  ngOnInit(): void {

    init_plugins();
    this.forma = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.sonIguales('password', 'password2')});

  }

  registrarUsuario(){
    if (this.forma.invalid){
      return;
    }
    if (!this.forma.value.condiciones){

      swal('Important', 'You need to accept the conditions', 'warning');
      return;
    }

    const usuario = new Usuario(
      this.forma.value.name,
      this.forma.value.email,
      this.forma.value.password
    );
    this.usuarioService.crearUsuario(usuario)
    .subscribe(resp => this.router.navigate(['/login']));
}
}

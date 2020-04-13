import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ],
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemporal: any;

  constructor(public usuarioService: UsuarioService) { 

    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
  }

  guardar(usuario: Usuario){

    this.usuario.name = usuario.name;
    
    if ( !this.usuario.google ){
      this.usuario.email = usuario.email;
    }
    
    this.usuarioService.actualizarUsuario(this.usuario)
    .subscribe();
  }

  seleccionImage( archivo: File) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    if ( archivo.type.indexOf('image') < 0 ) {
      swal.fire('Only images', 'The file is not an image', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;

    //=====================================================
    //Codigo de JS (vanilla)
    //=====================================================
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemporal = reader.result;
  }

  cambiarImagen() {
    this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}

import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { UploadFilesService } from '../../services/upload/upload-files.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ],
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemporal: any;

  constructor(
    public upload: UploadFilesService,
    public modalUploadService: ModalUploadService) {}

  ngOnInit(): void {
  }
 
  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemporal = null;

    this.modalUploadService.ocultarModal();
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

  // tslint:disable-next-line:adjacent-overload-signatures
  subirImagen() {
    this.upload.subirArchivo( this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
    .then( resp => {
      this.modalUploadService.notificacion.emit(resp);
      this.cerrarModal();
    })
    .catch( err  => {
      console.log('Error in loading...');
    });
  }
}

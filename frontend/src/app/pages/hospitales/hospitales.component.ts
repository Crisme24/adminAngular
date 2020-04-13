import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from '../../models/hospital.model';
import swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ],
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.modalUploadService.notificacion
    .subscribe( () => this.cargarHospitales());
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales(this.desde)
    .subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
    });
}

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }
    this.hospitalService.buscarHospital( termino )
    .subscribe( hospitales => this.hospitales = hospitales);
  }

  guardarHospital( hospital: Hospital ){
    this.hospitalService.actualizarHospital( hospital)
    .subscribe();
  }

  borrarHospital( hospital: Hospital ) {

    this.hospitalService.eliminarHospital( hospital._id )
    .subscribe( () => this.cargarHospitales() );
  }

  crearHospital() {
    swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del Hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !swal.isLoading()
    }).then((valor) => {
      if ( !valor.value || valor.value.length === 0) {
        return;
      }
 
      this.hospitalService.crearHospital( valor.value )
            .subscribe( () => this.cargarHospitales());
    });
 
  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  actualizarImagen( hospital: Hospital ) {

    this.modalUploadService.mostrarModal('hospitales', hospital._id);
  }

}

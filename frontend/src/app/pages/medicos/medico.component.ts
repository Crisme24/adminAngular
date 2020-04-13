import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoService } from '../../services/medico/medico.service';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from 'src/app/models/medico.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(public medicoService: MedicoService,
              public hospitalService: HospitalService,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public modalUploadService: ModalUploadService) {

                activatedRoute.params.subscribe( params => {

                  const id = params.id;

                  if ( id !== 'new' ) {
                    this.cargarMedico( id );
                  }

                });
              }

  ngOnInit(): void {
    this.hospitalService.cargarHospitalxMedico()
    .subscribe(hospitales => this.hospitales = hospitales);

    this.modalUploadService.notificacion
    .subscribe( resp => {

      this.medico.img = resp.medico.img;
    });
  }

  cargarMedico( id: string ){
    this.medicoService.cargarMedico(id)
    .subscribe(medico => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital(this.medico.hospital);
    });
  }

  guardarMedico( f: NgForm ) {
    console.log( f.valid);
    console.log( f.value);

    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico)
    .subscribe( medico => {
      this.medico._id = medico._id;
      this.router.navigate(['doctor', medico._id]);
    });
  }

  cambioHospital( id: string ) {

    this.hospitalService.obtenerHospitales( id )
    .subscribe( hospital => this.hospital = hospital );
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}

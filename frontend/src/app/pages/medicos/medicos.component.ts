import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medico/medico.service';
import { Medico } from 'src/app/models/medico.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ],
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  constructor(public medicoService: MedicoService, public router: Router) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos(this.desde)
    .subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.medicos = resp.medicos;
    });
  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedico(termino)
    .subscribe( medicos => this.medicos = medicos);
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
    this.cargarMedicos();
  }

  editarMedico(medico: Medico) {}

  borrarMedico(medico: Medico) {
    this.medicoService.borrarMedico(medico._id)
    .subscribe( () => this.cargarMedicos() );
  }

  actualizarImagen(medico: Medico) {}
}

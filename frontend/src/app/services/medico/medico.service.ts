import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { HospitalService } from '../hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import swal from 'sweetalert2';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalRegistros: number = 0;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService,
    public hospitalService: HospitalService) { }

  cargarMedicos(desde: number = 0){
    const url = URL_SERVICES + '/medicos?desde=' + desde;
    return this.http.get(url);
  }

  cargarMedico( id: string ) {
    const url = URL_SERVICES + '/medicos/' + id;
    return this.http.get(url)
    .pipe(map( (resp: any) => resp.medico ));
  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICES + '/medicos';

    if ( medico._id) {

      url += '/' + medico._id;
      url += '?token=' + this.usuarioService.token;

      return this.http.put( url, medico)
      .pipe(map( (resp: any) => {
        swal.fire('Updated doctor', medico.name, 'success');
        return resp.medico;
      }));
    }else{

      url += '?token=' + this.usuarioService.token;

      return this.http.post( url, medico )
      .pipe(map( (resp: any) => {
        swal.fire('Created doctor', medico.name, 'success');
        return resp.medico;
    }));
    }
  }

  buscarMedico( termino: string ){
    const url = URL_SERVICES + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get( url )
      .pipe(map( (resp: any) => resp.medicos));
  }

  borrarMedico( id: string ) {
    let url = URL_SERVICES + '/medicos/' + id;
    url += '?token=' + this.usuarioService.token;
    return this.http.delete(url)
      .pipe(map( resp => {
        swal.fire('Deleted doctor', 'Doctor was successfully removed', 'success');
        return resp;
      }));
  }
}

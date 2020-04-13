import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';
import { Hospital } from '../../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalRegistros: number = 0;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService) { }

  cargarHospitales( desde: number = 0 ) {
    const url = URL_SERVICES + '/hospitales?desde=' + desde;
    return this.http.get( url );
  }

  cargarHospitalxMedico() {
    const url = URL_SERVICES + '/hospitales';
    return this.http.get( url )
    .map( (resp: any) => {
      this.totalRegistros = resp.total;
      return resp.hospitales;
    });
  }

  obtenerHospitales( id: string ) {
    const url = URL_SERVICES + '/hospitales/' + id;
    return this.http.get( url)
    .map(( resp: any) => resp.hospital);
  }

  eliminarHospital( id: string ) {
    let  url = URL_SERVICES + '/hospitales/' + id;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete( url)
    .map( resp => swal.fire('Deleted hospital', 'Hospital successfully removed', 'success'));
  }

  crearHospital( name: string ) {
    let url = URL_SERVICES + '/hospitales';
    url += '?token=' + this.usuarioService.token;

    return this.http.post( url, {name})
    .map( (resp: any) => resp.hospital );
  }

  buscarHospital( termino: string ) {
    const url = URL_SERVICES + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get( url )
            .map( (resp: any) => resp.hospitales);
  }

  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICES + '/hospitales/' + hospital._id;
    url += '?token=' + this.usuarioService.token;
    return this.http.put(url, hospital)
          .map( (resp: any) => {
            swal.fire('Updated Hospital', hospital.name, 'success');
            return resp.hospital;
          });
  }

}

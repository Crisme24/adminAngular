import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICES } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  
  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string){

    return new Promise( (resolve, reject) => {

    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('imagen', archivo, archivo.name);

    xhr.onreadystatechange = () => {
      if ( xhr.readyState === 4 ) {
        if ( xhr.status === 200 ) {
          console.log('Imagen subida');
          resolve ( JSON.parse(xhr.response) );
        } else {
          console.log('Fallo la subida');
          reject ( xhr.response);
        }
      }
    };

    let url = URL_SERVICES + '/upload/' + tipo + '/' + id;

    xhr.open('PUT', url, true);
    xhr.send(formData);
  });
}

}
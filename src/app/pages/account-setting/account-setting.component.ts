import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';


@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styles: [
  ],
})
export class AccountSettingComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor(public ajustes: SettingsService) { }

  ngOnInit(): void {
    this.colocarCheck();
  }

  cambiarColor( tema: string, link: any ){
    this.aplicarCheck(link);
    this.ajustes.aplicarTema(tema);
  }

  aplicarCheck( link: any){
    const selectores: any = document.getElementsByClassName('selector');

    for (const ref of selectores){
      ref.classList.remove('working');
    }
    link.classList.add('working');
  }

  colocarCheck(): void {
    const selectores: any = document.getElementsByClassName('selector');
    const tema = this.ajustes.ajustes.tema;

    for (const ref of selectores){
      if (ref.getAttribute('data-theme') === tema ){
        ref.classList.add('working');
        break;
      }
    }
  }

}

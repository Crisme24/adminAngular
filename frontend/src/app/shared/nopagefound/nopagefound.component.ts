import { Component, OnInit } from '@angular/core';

declare function init_plugins();
@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: [`

    .error-box {
      height: 100vh;
      position: fixed;
      background: url(../../../assets/images/background/error-bg.jpg) no-repeat center center #fff;
      background-size: 50px 50px;
      background-size: 80%;
      width: 100%; 
    }
      .error-box .footer {
        width: 100%;
        left: 0px;
        right: 0px; 
      }

    .error-body {
      padding-top: 3%; 
    }
      .error-body h1 {
        font-size: 100px;
        font-weight: 700;
        text-shadow: 4px 4px 0 #ffffff, 6px 6px 0 #263238;
        line-height: 100px; 
      }
    `
  ],
})
export class NopagefoundComponent implements OnInit {

  anio: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
    init_plugins();
  }

}

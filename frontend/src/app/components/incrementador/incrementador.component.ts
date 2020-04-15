import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ],
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    //console.log('progreso', this.progreso);
  }

  ngOnInit(): void {
  }

  onChanges( newValues: number ) {
    // const elemHTML: any = document.getElementsByName('progreso')[0];

    if (newValues >= 100 ){
      this.progreso = 100;
    }else if (newValues <= 0 ){
      this.progreso = 0;
    }else{
      this.progreso = newValues;
    }

    // elemHTML.value = this.progreso;
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }

  cambiarValor(valor: number){

    if (this.progreso >= 100 && valor > 0){
      this.progreso = 100;
      return;
    }
    if (this.progreso <= 0 && valor < 0){
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + valor;
    this.cambioValor.emit(this.progreso);
    this.txtProgress.nativeElement.focus();
  }

}

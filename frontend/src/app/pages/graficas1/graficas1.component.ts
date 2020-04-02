import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: [
  ],
})
export class Graficas1Component implements OnInit {

  graficos: any = {
    grafico1: {
      labels: ['with beans', 'with custard', 'with bacon'],
      data:  [24, 30, 46],
      type: 'doughnut',
      leyenda: 'The bread is eaten'
    },
    grafico2: {
      labels: ['Man', 'Woman'],
      data:  [4500, 6000],
      type: 'doughnut',
      leyenda: 'Interviewed'
    },
    grafico3: {
      labels: ['Yes', 'Not'],
      data:  [95, 5],
      type: 'doughnut',
      leyenda: '¿Are allergic to bacon?'
    },
    grafico4: {
      labels: ['Yes', 'Not'],
      data:  [85, 15],
      type: 'doughnut',
      leyenda: 'Do you have a balanced diet?'
    },
  };

  constructor() { }

  ngOnInit(): void {
  }

}

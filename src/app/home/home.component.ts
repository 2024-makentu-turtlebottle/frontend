import { Component } from '@angular/core';
import { BarChartConfiguration, LineChartConfiguration } from './home';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('navbarIn', [
      state('0', style({ opacity: 0 })),
      state('1', style({ opacity: 1 })),
      transition('0 => 1', animate('0.5s', style({ opacity: 1 }))),
    ]),
    trigger('currentStateIn', [
      state('0', style({ opacity: 0 })),
      state('1', style({ opacity: 0 })),
      state('2', style({ opacity: 1 })),
      transition('* => 2', animate('0.5s', style({ opacity: 1 }))),
    ]),
  ]
})
export class HomeComponent {
  /**
   * 姿勢的狀態
   */
  public postureStatus: 'good' | 'bad' = 'bad';

  /**
   * 動畫狀態
   */
  public animationState = 0;

  /**
   * 劑量長條圖資料
   */
  public doseBarChartConfigurations: BarChartConfiguration = {
    labels: [],
    dataBars: [],
    displayLabelIndexes: [],
    displayDataBarIndexes: [],
    chartConfiguration: {
      datasets: [],
    },
    chartOptions: {},
  };

  /**
   * 體重表格資料
   */
  public weightLineChartConfigurations: LineChartConfiguration = {
    labels: [],
    dataPoints: [],
    displayLabelIndexes: [],
    displayDataPointIndexes: [],
    yMin: 0,
    yMax: 0,
    chartConfiguration: {
      datasets: [],
    },
    chartOptions: {},
  };

  ngOnInit(): void {
    setTimeout(() => {
      this.animationState++;
    }, 100);

    setTimeout(() => {
      this.animationState++;
    }, 200);

    this.doseBarChartConfigurations.labels = ['5/1', '5/2', '5/3', '5/4'];
    this.doseBarChartConfigurations.dataBars = [1, 2, 3, 4];
    this.doseBarChartConfigurations.chartConfiguration = {
      labels: this.doseBarChartConfigurations.labels,
      datasets: [
        {
          data: this.doseBarChartConfigurations.dataBars,
          backgroundColor: 'red',
          barThickness: 10,
          borderRadius: 2,
        },
      ],
    };
    this.doseBarChartConfigurations.chartOptions = {
      clip: false,
      responsive: true,
      layout: {
        padding: {
          top: 20,
          right: 10,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#1B1B1B',
          },
          border: {
            display: false,
          },
        },
        y: {
          suggestedMax: 3,
          grid: {
            display: true,
            color: '#CFBCB4',
          },
          ticks: {
            stepSize: 1,
            color: '#6933AD',
            padding: 18,
          },
          border: {
            display: false,
          },
        },
      },
    };

    this.weightLineChartConfigurations.labels = ['5/1', '5/2', '5/3', '5/4', '5/1', '5/2', '5/3'];
    this.weightLineChartConfigurations.dataPoints = [50, 60, 70, 80, 50, 60, 70];

    this.weightLineChartConfigurations.chartConfiguration = {
      labels: this.weightLineChartConfigurations.labels,
      datasets: [
        {
          data: this.weightLineChartConfigurations.dataPoints,
          fill: false,
          tension: 0,
          borderColor: '#430098',
          backgroundColor: '#430098',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#430098',
          pointHoverBackgroundColor: '#ddd',
          pointHoverBorderColor: '#430098',
        },
      ],
    };

    this.weightLineChartConfigurations.chartOptions = {
      responsive: true,
      layout: {
        padding: {
          right: 10,
        },
      },
      elements: {
        point: {
          borderWidth: 2,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#1B1B1B',
          },
          offset: true,
          border: {
            display: false,
          },
        },
        y: {
          grid: {
            display: true,
            color: '#CFBCB4',
          },
          ticks: {
            color: '#6933AD',
            padding: 15,
          },
          border: {
            display: false,
          },
        },
      },
    };
  }
}

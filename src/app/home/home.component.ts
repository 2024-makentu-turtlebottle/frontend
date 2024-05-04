import { Component } from '@angular/core';
import {
  BarChartConfiguration,
  LineChartConfiguration,
  TimedPosture,
  TimedPostureResponse,
} from './home';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Time } from '@angular/common';
import * as moment from 'moment';

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
    trigger('dayButton', [
      state('day', style({ backgroundColor: '#6933AD', color: '#eee' })),
      state('min', style({ backgroundColor: '#eee', color: '#6933AD' })),
      transition('day => min', animate('0.2s')),
      transition('min => day', animate('0.2s')),
    ]),
    trigger('minButton', [
      state('min', style({ backgroundColor: '#6933AD', color: '#eee' })),
      state('day', style({ backgroundColor: '#eee', color: '#6933AD' })),
      transition('day => min', animate('0.2s')),
      transition('min => day', animate('0.2s')),
    ]),
  ],
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
   * 包含時間的姿勢資料
   */
  private timedPostures: TimedPosture[] = [];

  /**
   * 時間範圍
   */
  public timeRange: 'day' | 'min' = 'min';

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
      labels: [],
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
      labels: [],
    },
    chartOptions: {},
  };

  /**
   * 是否正在載入
   */
  public loading: boolean = true;

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    await this.getPostureData();
    this.setChartConfigurations();

    setTimeout(() => {
      this.animationState++;
    }, 100);

    setTimeout(() => {
      this.animationState++;
    }, 200);
  }

  /**
   * 取得姿勢資料
   */
  private async getPostureData(): Promise<void> {
    this.loading = true;

    const response = await lastValueFrom(
      this.http.get<TimedPostureResponse>(
        `https://tzuhsun.online/api/1.0/influxdb?time=${this.timeRange}`
      )
    );

    this.timedPostures = response.data;

    console.log(this.timedPostures);

    for (const posture of this.timedPostures) {
      posture.timestamp = new Date(posture.time);
    }

    this.loading = false;
  }

  /**
   * 設定時間範圍
   */
  public async setTimeRange(timeRange: 'day' | 'min'): Promise<void> {
    this.timeRange = timeRange;
    this.animationState = 0;

    await this.getPostureData();
    this.setChartConfigurations();

    setTimeout(() => {
      this.animationState++;
    }, 100);

    setTimeout(() => {
      this.animationState++;
    }, 200);
  }

  /**
   * 重設圖表設定
   */
  private resetChartConfigurations(): void {
    this.doseBarChartConfigurations.labels = [];
    this.doseBarChartConfigurations.dataBars = [];
    this.weightLineChartConfigurations.labels = [];
    this.weightLineChartConfigurations.dataPoints = [];

    /**
     * 劑量長條圖資料
     */
    this.doseBarChartConfigurations = {
      labels: [],
      dataBars: [],
      displayLabelIndexes: [],
      displayDataBarIndexes: [],
      chartConfiguration: {
        datasets: [],
        labels: [],
      },
      chartOptions: {},
    };

    /**
     * 體重表格資料
     */
    this.weightLineChartConfigurations = {
      labels: [],
      dataPoints: [],
      displayLabelIndexes: [],
      displayDataPointIndexes: [],
      yMin: 0,
      yMax: 0,
      chartConfiguration: {
        datasets: [],
        labels: [],
      },
      chartOptions: {},
    };
  }

  /**
   * 設定圖表
   */
  private setChartConfigurations(): void {
    this.resetChartConfigurations();

    if (this.timedPostures.length === 0) {
      return;
    }

    if (this.timeRange === 'day') {
      // 取得一天前到現在，每四個小時的資料總和
      let startingTime = moment().subtract(1, 'day');
      const sixHours = moment.duration(6, 'hours');

      for (let i = 0; i < 4; i++) {
        const endTime = moment(startingTime).add(sixHours);

        const postures = this.timedPostures.filter(
          (posture) =>
            moment(posture.timestamp!).isAfter(startingTime, 's') &&
            moment(posture.timestamp!).isBefore(endTime, 's')
        );

        console.log(postures);

        // 傾斜角度大於 30 度視為不良姿勢
        const badPostures = postures.filter(
          (posture) => posture.value > 30 && posture.value < 90
        );

        this.doseBarChartConfigurations.labels.push(
          startingTime.format('HH:mm')
        );
        this.doseBarChartConfigurations.dataBars.push(badPostures.length);

        this.weightLineChartConfigurations.labels.push(
          startingTime.format('HH:mm')
        );
        this.weightLineChartConfigurations.dataPoints.push(
          (badPostures.length / postures.length) * 100
        );

        startingTime = endTime;
      }

      console.log(this.doseBarChartConfigurations.labels);
      console.log(this.doseBarChartConfigurations.dataBars);
    }

    if (this.timeRange === 'min') {
      // 取得 15 分鐘前到現在，每 3 分鐘的資料總和
      let startingTime = moment().subtract(15, 'minutes');
      const threeMinutes = moment.duration(3, 'minutes');

      for (let i = 0; i < 5; i++) {
        const endTime = moment(startingTime).add(threeMinutes);
        const postures = this.timedPostures.filter(
          (posture) =>
            moment(posture.timestamp!).isAfter(startingTime, 's') &&
            moment(posture.timestamp!).isBefore(endTime, 's')
        );

        // 傾斜角度大於 30 度視為不良姿勢
        const badPostures = postures.filter(
          (posture) => posture.value > 30 && posture.value < 90
        );

        this.doseBarChartConfigurations.labels.push(
          startingTime.format('HH:mm')
        );
        this.doseBarChartConfigurations.dataBars.push(badPostures.length);

        this.weightLineChartConfigurations.labels.push(
          startingTime.format('HH:mm')
        );
        this.weightLineChartConfigurations.dataPoints.push(
          (badPostures.length / postures.length) * 100
        );

        startingTime = endTime;
      }
    }

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

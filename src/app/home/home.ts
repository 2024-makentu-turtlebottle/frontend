import { ChartConfiguration, ChartOptions } from 'chart.js';

/**
 * 長條圖的資料
 */
export interface BarChartConfiguration {
  /**
   * 圖表下方的標籤
   */
  labels: string[];

  /**
   * 圖表的資料
   */
  dataBars: (number | null)[];

  /**
   * 顯示的標籤的index
   */
  displayLabelIndexes: number[];

  /**
   * 顯示的資料的index
   */
  displayDataBarIndexes: number[];

  /**
   * 圖表的資料
   */
  chartConfiguration: ChartConfiguration<'bar'>['data'];

  /**
   * 圖表的選項
   */
  chartOptions: ChartOptions<'bar'>;
}

/**
 * 折線圖的資料
 */
export interface LineChartConfiguration {
  /**
   * 圖表下方的標籤
   */
  labels: string[];

  /**
   * 圖表的資料點
   */
  dataPoints: (number | null)[];

  /**
   * 顯示的標籤的index
   */
  displayLabelIndexes: number[];

  /**
   * 顯示的資料點的index
   */
  displayDataPointIndexes: number[];

  /**
   * y軸的最小值
   */
  yMin: number;

  /**
   * y軸的最大值
   */
  yMax: number;

  /**
   * 圖表的資料
   */
  chartConfiguration: ChartConfiguration<'line'>['data'];

  /**
   * 圖表的選項
   */
  chartOptions: ChartOptions<'line'>;
}

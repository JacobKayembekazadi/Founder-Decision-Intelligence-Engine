
export enum ChartType {
  LINE = 'LINE',
  SCATTER = 'SCATTER',
  BAR = 'BAR',
  TREEMAP = 'TREEMAP',
  HISTOGRAM = 'HISTOGRAM'
}

export interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartDefinition {
  type: ChartType;
  title: string;
  data: ChartDataItem[];
  feature: string;
  benefit: string;
  insight: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface DecisionIntelligenceResponse {
  context: string;
  charts: ChartDefinition[];
  guidance: string;
  risk: string;
}

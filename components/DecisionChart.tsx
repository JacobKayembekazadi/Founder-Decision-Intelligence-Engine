
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, Cell, Treemap,
  ZAxis
} from 'recharts';
import { ChartDefinition, ChartType } from '../types';

interface DecisionChartProps {
  config: ChartDefinition;
}

const COLORS = ['#ffffff', '#a3a3a3', '#525252', '#262626', '#171717'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-2 text-[10px] mono uppercase tracking-wider">
        <p className="text-zinc-500 mb-1">{label}</p>
        <p className="text-white font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const DecisionChart: React.FC<DecisionChartProps> = ({ config }) => {
  const renderChart = () => {
    switch (config.type) {
      case ChartType.LINE:
        return (
          <LineChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
            <XAxis 
              dataKey="name" 
              stroke="#525252" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              label={config.xAxisLabel ? { value: config.xAxisLabel, position: 'insideBottom', offset: -5, fill: '#525252', fontSize: 10 } : undefined}
            />
            <YAxis 
              stroke="#525252" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              label={config.yAxisLabel ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft', fill: '#525252', fontSize: 10 } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4, fill: '#fff' }} />
          </LineChart>
        );

      case ChartType.BAR:
      case ChartType.HISTOGRAM:
        return (
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
            <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#ffffff">
              {config.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === config.data.length - 1 ? '#ffffff' : '#404040'} />
              ))}
            </Bar>
          </BarChart>
        );

      case ChartType.SCATTER:
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
            <XAxis type="category" dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis type="number" dataKey="value" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
            <ZAxis type="number" dataKey="secondaryValue" range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Signals" data={config.data} fill="#ffffff" />
          </ScatterChart>
        );

      case ChartType.TREEMAP:
        return (
          <Treemap
            data={config.data}
            dataKey="value"
            stroke="#0a0a0a"
            fill="#ffffff"
            content={<CustomTreemapContent />}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[11px] mono uppercase tracking-widest text-zinc-500 mb-1">{config.type} ANALYSIS</h3>
          <h2 className="text-sm font-bold tracking-tight uppercase text-white">{config.title}</h2>
        </div>
        <div className="h-[1px] bg-zinc-800 flex-grow mx-4 mt-6"></div>
        <div className="text-[10px] mono text-zinc-600 border border-zinc-800 px-2 py-1">CONFIDENTIAL</div>
      </div>
      
      <div className="flex-grow min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
        <div>
          <span className="text-[9px] mono uppercase text-zinc-600 block mb-1">Feature</span>
          <p className="text-[11px] leading-relaxed text-zinc-300">{config.feature}</p>
        </div>
        <div>
          <span className="text-[9px] mono uppercase text-zinc-600 block mb-1">Benefit</span>
          <p className="text-[11px] leading-relaxed text-zinc-300">{config.benefit}</p>
        </div>
        <div className="md:col-span-2 mt-2 bg-zinc-900/50 p-3 border-l-2 border-white">
          <span className="text-[9px] mono uppercase text-white block mb-1 font-bold">Decision Insight</span>
          <p className="text-[12px] leading-relaxed text-zinc-100 font-medium italic">{config.insight}</p>
        </div>
      </div>
    </div>
  );
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, index, name } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: '#0a0a0a',
          strokeWidth: 1,
        }}
      />
      {width > 40 && height > 20 && (
        <text
          x={x + 5}
          y={y + 15}
          fill={index === 0 ? '#000' : '#fff'}
          fontSize={10}
          fontFamily="JetBrains Mono"
          className="uppercase tracking-tighter"
        >
          {name}
        </text>
      )}
    </g>
  );
};

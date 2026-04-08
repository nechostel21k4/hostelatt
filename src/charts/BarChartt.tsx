import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface BarChartProps {
  data: any[];
  title?: string;
  bars: BarConfig[];
  xAxisKey?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: 0, color: entry.fill }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const BarChartt: React.FC<BarChartProps> = ({ data, title, bars, xAxisKey = "name" }) => {
  return (
    <div style={{ width: '99%', height: 350, minHeight: '350px', minWidth: 0 }}>
      {title && <h5 className="text-center mb-2" style={{ color: '#555' }}>{title}</h5>}
      <ResponsiveContainer width="100%" height="100%" debounce={200}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartt;

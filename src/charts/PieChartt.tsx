import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{payload[0].name}</p>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
          Count: <span style={{ fontWeight: 'bold', color: payload[0].fill }}>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PieChartt = (props: any) => {
  const { data, total } = props;

  // Transform data and handle null/empty, ensure values are Numbers
  const pieData = (data && Array.isArray(data))
    ? data.map((item: any, index: number) => ({
      name: item.label || 'Unknown',
      value: Number(item.value) || 0,
      fill: COLORS[index % COLORS.length]
    }))
    : [];

  const validTotal = total || pieData.reduce((acc, cur) => acc + cur.value, 0);
  const isEmpty = pieData.length === 0 || pieData.every(item => item.value === 0);

  return (
    <div style={{ width: '100%', height: 350, position: 'relative', minHeight: '350px' }}>
      {isEmpty ? (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#999'
        }}>
          <div style={{
            width: 120, height: 120,
            borderRadius: '50%', border: '8px solid #f0f0f0',
            marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#dedede' }}>0</span>
          </div>
          <span>No Data Available</span>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={4}
                dataKey="value"
                isAnimationActive={true}
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ bottom: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Label */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -80%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#333' }}>{validTotal}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default PieChartt;

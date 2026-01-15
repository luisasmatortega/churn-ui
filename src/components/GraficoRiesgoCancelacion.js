"use client";

import React, { useMemo, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text, Legend } from 'recharts';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';


const yAxisLabels = ['55%', '40%', '30%', '20%', '0%'];

const GraficoRiesgoCancelacion = ({resumen}) => {

  const chartData = useMemo(() => 
  [
    { 
      name: 'Se va', 
      value: resumen.riesgoAlto, 
      color: '#f87171', 
      icon: AlertTriangle, 
      percentage: resumen.porcentajeAlto 
    },
    { 
      name: 'No se va', 
      value: resumen.riesgoBajo, 
      color: '#4ade80', 
      icon: CheckCircle2, 
      percentage: resumen.porcentajeBajo 
    },
  ], 
  [
      resumen.riesgoAlto,
      resumen.riesgoBajo,
      resumen.porcentajeAlto,
      resumen.porcentajeBajo,
  ]);
 

  const legendFormatter = useMemo(
    () => (value) => (
      <span className="text-slate-600 font-medium text-sm">{value}</span>
    )
  );
  
  return (
    <>
      <h3 className="font-semibold mb-4 ">Distribución del Riesgo de Cancelación</h3>
      <div className="relative h-72 w-full  lg:pr-28">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-16 ">
          {yAxisLabels.map((label, i) => (
            <div key={label} className="flex items-center w-full"> 
              {/* <span className="text-xs text-slate-400 w-8">{label}</span> */}
              <div className="flex-1 border-t border-slate-300 ml-2" />
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%" 
              innerRadius={0}
              outerRadius={80}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
              label={(props) => renderLabel({ ...props, chartData })}
              labelLine={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
                            
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: 6,         
              }}
              formatter={legendFormatter}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='hidden sm:block sm:absolute sm:top-0 sm:right-0 pt-3 translate-y-1/2 '>
          <div className="flex flex-col gap-3 ">
            {chartData.map((item) => (
              <RiesgoResumenItem 
                key={item.name}
                name={item.name}
                value={item.value}
                color={item.color}
                Icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};


export default memo(GraficoRiesgoCancelacion);

const renderLabel = ({ cx, cy, midAngle, outerRadius, index, chartData }) => 
  {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central" 
        className="text-lg font-semibold"
      >
        {chartData[index].percentage}
      </text>
    );
  };

const RiesgoResumenItem = memo(({ name, value, color, Icon }) => (
  <div className="flex items-center justify-between p-2 md:p-3 rounded-md border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center gap-2">
      <Icon size={18} className="shrink-0" style={{ color }} />
      <span className="text-sm font-bold text-slate-700">{value}</span>
      <span className="text-xs text-slate-500">{name}</span>
    </div>
  </div>
));

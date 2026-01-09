"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text, Legend } from 'recharts';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

// const data = [
//   { name: 'Se va', value: 303, color: '#f87171', icon: AlertTriangle, percentage: '61%' },
//   { name: 'No se va', value: 194, color: '#4ade80', icon: CheckCircle2, percentage: '39%' },
// ];

const yAxisLabels = ['55%', '40%', '30%', '20%', '0%'];

export default function GraficoRiesgoCancelacion({resumen}) {

  const chartData = [
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
  ];
  
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
              label={({ cx, cy, midAngle, outerRadius, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius * 0.6;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-lg font-semibold">
                    {chartData[index].percentage}
                  </text>
                );
              }}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
              formatter={(value) => (
                <span className="text-slate-600 font-medium text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='hidden sm:block sm:absolute sm:top-0 sm:right-0 pt-3 translate-y-1/2 '>
          <div className="flex flex-col gap-3 ">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-sm border border-slate-300 bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <item.icon size={18} style={{ color: item.color }} fill={item.color} fillOpacity={0.1} />
                  <span className="sm:text-sm font-bold text-slate-700">{item.value}</span>
                  <span className="text-slate-500"> {item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

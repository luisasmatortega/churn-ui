"use client";

import React, { Childrenm, useState, useEffect } from 'react';
import { prediccionService } from '@/services/prediccionService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


const CustomTooltip = ({ active, payload, label, mode }) => 
{
  if (!active || !payload?.length) return null;

  const dataTooltip = payload[0].payload;
  
  return (
    <div className="bg-sky-950 p-4 rounded-xl shadow-xl text-white min-w-16 text-xs">
      <p className="font-medium mb-3 border-b border-slate-600 pb-1 flex justify-between">
        <span>{label}</span>
      </p>
      
      <div className="space-y-2">
        {(mode === "RISK" || mode === "DISTRIBUTION") && (
          <div className="flex justify-between">
            <span className="text-slate-300">Usuarios en riesgo:</span>
            <span>{dataTooltip.churnCount}</span>
          </div> 
        )}
        {(mode === "STABLE" || mode === "DISTRIBUTION") && (
          <div className="flex justify-between">
            <span className="text-slate-300">Usuarios estables:</span>
            <span>{dataTooltip.noChurnCount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-300">Total usuarios:</span>
          <span>{dataTooltip.totalUsers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">% Cancelación:</span>
          <span>{dataTooltip.churnPercentage}</span>
        </div>
      </div>
    </div>
  );
};


export default function GraficoPromedioCancelacion() 
{
  const gradientChurnId = "churnGradient";
  const gradientNoChurnId = "noChurnGradient";

  const [mode, setMode] = useState("RISK");
  const [refinedData, setRefinedData] = useState([]);

  useEffect(() => {
    prediccionService.obtenerCancelacionMensual()
      .then(setRefinedData);
  }, []);


  const data = refinedData.map((monthData) => (
  {
    month: monthData.month,
    churnPercentage: monthData.seVaPercentage,
    churnCount: monthData.seVaCount,
    totalUsers: monthData.totalUsers,
    // aditional derived info
    noChurnCount: monthData.totalUsers - monthData.seVaCount,
    noChurnPercentage: 100 - monthData.seVaPercentage
  }))


  return (
    <>
      <h3 className="font-semibold">Tendencia de Cancelación de Usuarios <span className='opacity-40'>(6 últimos meses)</span></h3>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        <ModeButton active={mode === "RISK"} onClick={() => setMode("RISK")}>
          En riesgo
        </ModeButton>
        <ModeButton active={mode === "STABLE"} onClick={() => setMode("STABLE")}>
          Usuarios estables
        </ModeButton>
        <ModeButton
          active={mode === "DISTRIBUTION"}
          onClick={() => setMode("DISTRIBUTION")}
        >
          Distribución total
        </ModeButton>
      </div>

      <div className="-ml-5 mt-4 w-full h-60 pb-8 md:pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientChurnId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id={gradientNoChurnId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.3}/>
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E5E5F4"
              strokeDasharray="1"
              strokeOpacity={0.5}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />

            <Tooltip
              content={<CustomTooltip mode={mode}/>}
              cursor={{ stroke: '#64748b', strokeDasharray: '4 4' }}
            />

            {(mode === "RISK" || mode === "DISTRIBUTION") && (
              <Area
                type="monotone"
                dataKey="churnPercentage"
                name="% Cancelación"
                stroke="#f87171"
                fill={`url(#${gradientChurnId})`}
                strokeWidth={2}
              />
            )}

            {(mode === "STABLE" || mode === "DISTRIBUTION") && (
              <Area
                type="monotone"
                dataKey="noChurnPercentage"
                name="% Bajo riesgo"
                stroke="#4ade80"
                fill={`url(#${gradientNoChurnId})`}
                strokeWidth={2}
              />

            )}

          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center justify-center gap-1 text-xs md:text-base md:gap-4 ">
          {(mode === "RISK" || mode === "DISTRIBUTION") && (
            <LegendItem color="#f87171" label="Usuarios con riesgo de cancelación (%)" />
          )}
          {(mode === "STABLE" || mode === "DISTRIBUTION") && (
            <LegendItem color="#4ade80" label="Usuarios en bajo riesgo de cancelación (%)" />

          )}
        </div>
      </div>
    </>
    
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: color }} />
      <span className=" text-slate-500 font-medium">{label}</span>
    </div>
  );
}

const ModeButton = ({active, children, onClick}) => 
{
  return (
    <button 
    type="button"
    onClick={onClick}
    className={`px-3 py-1 text-xs font-medium rounded-md transition
      ${active ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}      
    `}
    
    >
      {children}
    </button>
  )
}





// const refinedData = 
// [
//   {
//     "month": "Julio",
//     "averageScore": 42.5, // La probabilidad GENERAL de cancelaciòn de usuarios
//     "seVaCount": 303,      // numero de usuarios > umbralDeRetiro
//     "seVaPercentage": 61,  // Population Distribution (%)
//     "totalUsers": 498
//   },
//   { month: "Ago", averageScore: 49.8, seVaCount: 350, seVaPercentage: 64, totalUsers: 545 },
//   { month: "Sep", averageScore: 44.2, seVaCount: 315, seVaPercentage: 58, totalUsers: 540 },
//   { month: "Oct", averageScore: 41.0, seVaCount: 290, seVaPercentage: 54, totalUsers: 535 },
//   { month: "Nov", averageScore: 38.5, seVaCount: 270, seVaPercentage: 50, totalUsers: 540 },
//   { month: "Dic", averageScore: 35.0, seVaCount: 250, seVaPercentage: 46, totalUsers: 545 },
//   {
//     "month": "Enero",
//     "averageScore": 42.5,
//     "seVaCount": 303,     
//     "seVaPercentage": 61, 
//     "totalUsers": 498
//   },
// ]
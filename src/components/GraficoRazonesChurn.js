"use client"

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const churnReasonsData = [
  { reason: "Dias con el equipo móvil", users: 182 },
  { reason: "Llamadas caídas", users: 156 },
  { reason: "Antigüedad", users: 121 },
  { reason: "Cargo recurrente", users: 98 },
  { reason: "Perfil crediticio", users: 67 },
  { reason: "Ingresos mensuales", users: 41 },
];

// ordenado descendente
const data = [...churnReasonsData].sort((a, b) => b.users - a.users);

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
];

export default function GraficoTopRazonesChurn() {
  const total = data.reduce((acc, d) => acc + d.users, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
    
      <div className="mb-6">
        <h3 className="font-bold text-slate-800">
          Principales razones de cancelación
        </h3>
        <p className="text-xs text-slate-500">
          Top factores que explican la salida de clientes
        </p>
      </div>


      <div className="h-72 w-full">
        <ResponsiveContainer className={`w-full h-full`}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />
            <YAxis
              type="category"
              dataKey="reason"
              tick={{ fontSize: 12 }}
              width={160}
              stroke="#94a3b8"
            />

            <Tooltip
              cursor={{ fill: "rgba(148,163,184,0.1)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;

                return (
                  <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl">
                    <p className="font-bold mb-1">{d.reason}</p>
                    <p>Clientes afectados: <strong>{d.users}</strong></p>
                    <p>
                      {Math.round((d.users / total) * 100)}% del churn total
                    </p>
                  </div>
                );
              }}
            />

            <Bar dataKey="users" radius={[0, 8, 8, 0]} barSize={18}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
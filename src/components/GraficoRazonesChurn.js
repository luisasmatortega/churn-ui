"use client"

import { prediccionService, } from "@/services/prediccionService";
import React, { useState, useEffect, useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
];

export default function GraficoTopRazonesChurn() 
{
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const total = useMemo(
    () => data.reduce((acc, d) => acc + d.users, 0),
    [data]
  );

  const topReason = useMemo(() => {
    if (!data.length) return null;
    return data.reduce((a, b) => (a.users > b.users ? a : b));
  }, [data]);

  const insightText = topReason
  ? `"${topReason.reason}" explica el ${Math.round(
      (topReason.users / total) * 100
    )}% del churn total, siendo el principal factor de cancelación.`
  : null;

  useEffect(() => {
    const fetchRazones = async () => {
      try {
        const res = await prediccionService.obtenerTopRazonesChurn();
        setData(res);
      } catch (e) {
        console.error("Error cargando razones de churn", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRazones();
  }, []);

  
  if (loading) 
  {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-80 flex items-center justify-center">
        <span className="text-sm text-slate-500">
          Cargando razones de cancelación…
        </span>
      </div>
    );
  }



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
              <LabelList
                dataKey="users"
                position="right"
                fontSize={11}
                formatter={(v) =>
                  `${Math.round((v / total) * 100)}%`
                }
              />
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight */}
      {insightText && (
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
          <p className="text-[0.625rem] text-slate-600 leading-relaxed">
            {insightText}sdfsdf
          </p>
        </div>
      )}
    </div>
  );
}
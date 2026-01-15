"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { prediccionService } from "@/services/prediccionService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";
import { Zap, ShieldCheck, Clock, Users } from "lucide-react";


const ICON_MAP = {
  NEW: Zap,
  STABLE: ShieldCheck,
  VETERAN: Clock,
};

const COLOR_MAP = {
  NEW: "#3b82f6",
  STABLE: "#10b981",
  VETERAN: "#8b5cf6",
};


export default function GraficoPromedioAntiguedad() 
{
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prediccionService.obtenerAntiguedadMesActual()
      .then((data) => {
        setSnapshot(data);
      })
      .finally(() => setLoading(false));
  }, []);
  
  const dominantSegment = useMemo(() => {
    if (!snapshot || !snapshot.segments) return null; // Add safety check
    return snapshot.segments.reduce((prev, current) =>
      prev.users > current.users ? prev : current
    );
  }, [snapshot]);

  const data = useMemo(() => 
  {
    if (!snapshot) return [];

    const totalInSegments = snapshot.segments.reduce((acc, s) => acc + s.users, 0);

    return snapshot.segments.map((segment) => ({
      name: segment.label,
      avgMonths: segment.avgMonths,
      users: segment.users,
      fill: COLOR_MAP[segment.key],
      icon: ICON_MAP[segment.key],
      key: segment.key,
      percentage: totalInSegments > 0 
      ? Math.round((segment.users / totalInSegments) * 100) 
      : 0
    }));


  }, [snapshot]);
     
  const globalAvg = useMemo(() => {
    return snapshot?.globalAvgMonths ? Number(snapshot.globalAvgMonths.toFixed(1)) : 0;
  }, [snapshot]);


  const insightText = useMemo(() => 
  {
    if (!dominantSegment) return "";

    const { key, users } = dominantSegment;

    if(key === "STABLE") return `La base de clientes està consolidada por el segmento de "Estables" es el más numeroso con ${users} usuarios.`;
    if (key === "NEW") return `Fase de crecimiento: los usuarios "Nuevos" predominan, sugiriendo una captación reciente.`;

    return `Base madura: el segmento de "Veteranos" lidera, indicando alta retención histórica.`;

  }, [dominantSegment]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 text-sm text-slate-500 h-64 animate-pulse">
        Cargando antigüedad de clientes…
      </div>
    );
  }

  if (!snapshot) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-slate-800">
            Antigüedad promedio del cliente <span className="text-slate-800 opacity-25">({snapshot.month})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Meses en servicio por segmento
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-slate-900 md:text-2xl">
            {globalAvg}
          </p>
          <p className="text-[10px] uppercase text-slate-400 font-bold">
            Meses promedio
          </p>
        </div>
      </div>

      <div className="h-56 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 20, right: 20 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />

            <Tooltip
              cursor={{ fill: "rgba(148,163,184,0.1)" }}
              content={<AntiguedadTooltip />}
            />

            <ReferenceLine
              x={globalAvg}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                value: "Promedio global",
                position: "top",
                fontSize: 10,
                fill: "#ef4444",
              }}
            />

            <Bar
              dataKey="avgMonths"
              radius={[0, 8, 8, 0]}
              barSize={18}
            >
            {data.map((entry) => <Cell key={entry.name} fill={entry.fill} /> )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

  
      <div className="space-y-2">
        {data.map((item) => (
          <SegmentDiffItem 
            key={item.key}
            item={item}
            globalAvg={globalAvg}
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
        <div className="flex items-start gap-2">
          <Users size={14} className="text-blue-600 mt-1" />
          <p className="text-[0.625rem] text-slate-600 leading-relaxed">
            {insightText}
          </p>
        </div>
      </div>
    </div>
  );
}


const SegmentDiffItem = ({ item, globalAvg }) => 
{ 
  const diff = item.avgMonths - globalAvg;
          
  return (
    <div className="flex justify-between items-center text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <item.icon size={14} className="text-slate-500" />
        <span className="font-medium">{item.name}</span>
      </div>
      <div className="text-right">
        <span className="font-bold text-slate-800">
          {item.avgMonths}
        </span>
        <span
          className={`ml-2 font-bold ${
            diff >= 0
              ? "text-emerald-600"
              : "text-rose-600"
          }`}
        >
          {diff >= 0 ? "+" : ""}
          {diff.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

const AntiguedadTooltip = memo(({ active, payload }) => 
{
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-sky-950 text-slate-200 p-3 rounded-xl text-xs shadow-xl">
      <p className="font-bold mb-2 border-b border-slate-700 pb-1">{d.name}</p>
      <p className="text-slate-200">Promedio: <strong>{d.avgMonths} meses</strong></p>
      <p className="text-slate-200">Clientes: {d.users}</p>
      <p className="text-blue-300">
        {d.percentage}% de la base mensual
      </p>
    </div>
  );
})
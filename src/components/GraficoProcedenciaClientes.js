"use client";

import React from 'react';

const regions = [
  { name: 'Región Norte', percentage: '37%', clients: '45 clientes', value: 45, color: 'bg-[#5c8ef2]' },
  { name: 'Región Sur', percentage: '28%', clients: '35 clientes', value: 35, color: 'bg-[#5c8ef2]' },
  { name: 'Región Centro', percentage: '22%', clients: '27 clientes', value: 27, color: 'bg-[#76c893]' },
  { name: 'Región Este', percentage: '13%', clients: '16 clientes', value: 16, color: 'bg-[#b5e48c]' },
];

export default function RegionOriginStats() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-semibold text-slate-700 mb-6">Procedencia de los Clientes</h3>
      
      <div className="flex flex-col gap-2">
        {regions.map((region, index) => (
          <div 
            key={region.name} 
            className={`flex items-center justify-between py-4 ${
              index !== regions.length - 1 ? 'border-b border-slate-50' : ''
            }`}
          >
            {/* Info Section: Region, %, and Client Count */}
            <div className="flex items-center gap-4 w-1/2">
              <span className="text-sm text-slate-500 font-medium min-w-[90px]">
                {region.name}
              </span>
              <span className="text-sm font-bold text-slate-800">
                {region.percentage}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {region.clients}
              </span>
            </div>

            {/* Progress Bar and Total Count */}
            <div className="flex items-center gap-4 flex-1">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${region.color} rounded-full`} 
                  style={{ width: region.percentage }}
                />
              </div>
              <span className="text-sm font-medium text-slate-500 w-4 text-right">
                {region.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
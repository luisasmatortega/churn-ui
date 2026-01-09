"use client"

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { User, PhoneOff, Calendar, CreditCard, Smartphone, Send, Phone, Megaphone } from 'lucide-react';
import { prediccionService } from '@/services/prediccionService';


const PAGE_SIZE = 10;

export default function TablaClientesRiesgo({  }) 
{
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await prediccionService.obtenerRankingRiesgo(page, PAGE_SIZE);
      setCustomers(res.content);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    tableRef.current?.scrollTo({ top: 0 });
  }, [customers]);


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200" >
      <div className="p-6 border-b border-slate-100 bg-white">
        <h3 className="font-bold text-slate-800 text-lg">Ranking de Riesgo de Cancelación</h3>
        <p className="text-xs text-slate-500">Lista de clientes ordenados por probabilidad de retiro</p>
      </div>

      <div className="overflow-x-auto w-full flex-shrink-0"
      ref={tableRef}
      style={{ overflowAnchor: "none" }}
      >
        {loading && (
           <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
             <span className="text-sm text-slate-500">
               Cargando ranking…
             </span>
           </div>
        )}
        <table className=" w-full text-left border-collapse">
          <thead className=''>
            <tr className="bg-slate-100 text-slate-400 text-[0.625rem] uppercase font-bold tracking-widest border-y border-slate-300">
              <th className="p-4">ID Cliente</th>
              <th className="p-4">Nombre Completo</th>
              <th className="p-4">Finanzas</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Crédito</th>
              <th className="p-4">Prob. Cancelación</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 ">
            {customers.map((customer) => (
              <tr key={customer.id} className=" hover:bg-slate-50 transition-colors">
                
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">#{customer.id}</span>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center">
                    <span className="text-xs text-slate-700">{customer.nombreCompleto}</span>
                  </div>
                </td>

                
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-600">
                      <CreditCard size={12} />
                      <span className="text-xs font-medium">${customer.ingresosMensuales} / mes</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Cargo Rec.: ${customer.cargoRecurrente}</span>
                  </div>
                </td>

                
                <td className="p-4">
                  <div className="flex flex-col gap-1 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span className="text-xs">{customer.mesesEnServicio} meses</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Smartphone size={10} />
                      <span>Equipo con {customer.diasEquipoActual} días</span>
                    </div>
                  </div>
                </td>

                
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md text-[0.625rem] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                    {customer.calificacionCrediticia}
                  </span>
                </td>

                
                <td className="p-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-red-600">
                        {(customer.cancelacionProbabilidad * 100).toFixed(1)}%
                      </span>
                      {customer.llamadasCaidas > 3 && (
                         <div className="flex items-center gap-1 text-orange-500" title="Llamadas caídas críticas">
                           <PhoneOff size={12} />
                           <span className="text-[10px] font-bold">{customer.llamadasCaidas}</span>
                         </div>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${customer.cancelacionProbabilidad * 100}%` }}
                      />
                    </div>
                  </div>
                </td>


                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botón Marketing: Solo aparece con opacidad baja y resalta al hover */}
                    <button 
                      title="Enviar a Marketing"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Megaphone size={16} />
                    </button>
                    
                    {/* Botón Llamar: Si el riesgo es muy alto (>90%), le ponemos un color más llamativo */}
                    <button 
                      title="Llamar Cliente"
                      className={`p-2 rounded-lg transition-all ${
                        customer.cancelacionProbabilidad > 0.9 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Phone size={16} />
                    </button>
                     <a 
                      title="Ir a perfil"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      href='/user/perfil'
                    >
                      <User size={16} />
                    </a>
                  </div>
                </td>



              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-100" >
        <span className="text-xs text-slate-500">
          Página {page + 1} de {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={loading || page === 0}
            className="p-2 rounded-lg border border-slate-700 cursor-pointer disabled:opacity-40 hover:bg-slate-100"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || page + 1 >= totalPages}
            className="p-2 rounded-lg border border-slate-700 cursor-pointer disabled:opacity-40 hover:bg-slate-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
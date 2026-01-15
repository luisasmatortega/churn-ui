"use client"

import React, { useState, useEffect, useRef, memo } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { User, PhoneOff, Calendar, CreditCard, Smartphone, Phone, Megaphone } from 'lucide-react';
import { prediccionService } from '@/services/prediccionService';


const PAGE_SIZE = 10;

export default function TablaClientesRiesgo({  }) 
{
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => 
  {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await prediccionService.obtenerRankingRiesgo(
          page,
          PAGE_SIZE,
          controller.signal
        );
        setCustomers(res.content);
        setTotalPages(res.totalPages);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
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

  useEffect(() => {
    tableRef.current?.scrollTo({ top: 0 });
  }, [customers]);

  

  if (loading && customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-80 flex items-center justify-center">
        <span className="text-sm text-slate-500">
          Cargando ranking…
        </span>
      </div>
    );
  }


  return (
    <div className="px-2 sm:px-10 md:px-0 bg-white rounded-2xl shadow-sm border border-slate-200" >
      <div className="p-6 border-b border-slate-100 bg-white">
        <h3 className="font-bold text-slate-800 text-lg">Ranking de Riesgo de Cancelación</h3>
        <p className="text-xs text-slate-500">Lista de clientes ordenados por probabilidad de retiro</p>
      </div>

      <div className="hidden md:block">
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

        <PaginationControls 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={loading}
        />

      </div>

      <div className="md:hidden space-y-3">
        {customers.map((customer) => (
          <ClienteRiesgoCard key={customer.id} customer={customer} />
        ))}
        <PaginationControls 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={loading}
          
        />
      </div>


    </div>
  );
}


const ClienteRiesgoCard = memo(({ customer }) => 
{
  const riesgo = Math.min(
    100,
    Math.max(0, customer.cancelacionProbabilidad * 100)
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">

      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-slate-800 text-sm">
            {customer.nombreCompleto}
          </p>
          <p className="text-[10px] text-slate-400">
            ID #{customer.id}
          </p>
        </div>

        <span className="text-lg font-black text-red-600">
          {riesgo.toFixed(1)}%
        </span>
      </div>


      <div className="w-full h-2 bg-slate-100 rounded-full mb-3">
        <div
          className="h-full bg-red-500 rounded-full"
          style={{ width: `${riesgo}%` }}
        />
      </div>


      <div className="text-xs text-slate-600 flex justify-between mb-3">
        <span>${customer.ingresosMensuales}/mes</span>
        <span>{customer.mesesEnServicio} meses</span>
      </div>


      {customer.llamadasCaidas > 3 && (
        <div className="flex items-center gap-1 text-orange-500 text-xs mb-3">
          <PhoneOff size={12} />
          <span>{customer.llamadasCaidas} llamadas caídas</span>
        </div>
      )}


      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 font-bold text-xs">
          Llamar
        </button>
        <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600">
          <Megaphone size={16} />
        </button>
      </div>
    </div>
  );
});


const PaginationControls = memo(({
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading = false
}) => 
{
  const buttonStyles = "p-2 rounded-lg border border-slate-700 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors";


  const handlePrev = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-100">
      <span className="text-xs text-slate-500 font-medium">
        Página <span className="text-slate-900">{currentPage + 1}</span> de <span className="text-slate-900">{totalPages}</span>
      </span>

      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          disabled={isLoading || currentPage === 0}
          className={buttonStyles}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading || currentPage + 1 >= totalPages}
          className={buttonStyles}
          aria-label="Siguiente página"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
});
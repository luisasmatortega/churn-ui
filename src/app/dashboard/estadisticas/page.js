"use client"

import ResumenCard from "@/components/ResumenCard";
import Navbar from "@/components/NavBar";
import { useState, useEffect, useMemo } from "react";
import { FileText, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { prediccionService } from "@/services/prediccionService";
import dynamic from "next/dynamic";


const GraficoPromedioAntiguedad = dynamic(
  () => import("@/components/GraficoPromedioAntiguedad"),
  { ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Cargando gráfico…
      </div>
    ),
   }
);

const GraficoPromedioCancelacion = dynamic(
  () => import("@/components/GraficoPromedioCancelacion"),
  { ssr: false, 
    loading: () => (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Cargando gráfico…
      </div>
    ),
  }
);

const GraficoRiesgoCancelacion = dynamic(
  () => import("@/components/GraficoRiesgoCancelacion"),
  { ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Cargando gráfico…
      </div>
    ), 
  }
);

const GraficoTopRazonesChurn = dynamic(
  () => import("@/components/GraficoRazonesChurn"),
  { ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Cargando gráfico…
      </div>
    ),
  }
);

const TablaClientesRiesgo = dynamic(
  () => import("@/components/TablaClientesEnRiesgoDeCancelacion"),
  { ssr: false, 
    loading: () => (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Cargando gráfico…
      </div>
    ),
  }
);

export default function estadisticasPage() 
{
  
  const [resumen, setResumen] = useState(
  { 
    totalConsultas: 0, 
    riesgoAlto: 0,
    riesgoBajo: 0, 
    porcentajeAlto: "0%", 
    porcentajeBajo: "0%" 
  });

  useEffect(() => {
    prediccionService.obtenerResumen()
      .then(setResumen)
      .catch(err => console.error("Error:", err));
  }, []);

  


  return (
    <>
    <Navbar />
    
    <main className="min-h-screen p-2 md:py-6 md:px-8 space-y-4 bg-primary">
      
      <div className="space-y-4 bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="md:text-2xl font-semibold text-slate-700">Estadisticas</h1>
        
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4">
          <ResumenCard title="Total Consultas" value={resumen.totalConsultas} icon={FileText} colorClass="text-blue-600 " />
          <ResumenCard title="Riesgo Alto" value={resumen.riesgoAlto} percentage={resumen.porcentajeAlto} icon={AlertTriangle} colorClass="text-red-500  " />
          <ResumenCard title="Riesgo Bajo" value={resumen.riesgoBajo} percentage={resumen.porcentajeBajo} icon={CheckCircle2} colorClass="text-green-500" />
        </div>

        <hr className="text-slate-300 "/>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 ">
          <div className=" ">
            <GraficoRiesgoCancelacion resumen={resumen}/>
          </div>
          
          <div className=" ">
            <GraficoPromedioCancelacion />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <div className="">
           <GraficoPromedioAntiguedad />
        </div>
         <div className="">
           <GraficoTopRazonesChurn />
        </div>
      </div>

      <div className="">
        <TablaClientesRiesgo />
      </div>
    </main>
    </>
  );
}
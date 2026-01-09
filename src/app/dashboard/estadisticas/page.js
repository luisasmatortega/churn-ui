"use client"

import GraficoPromedioAntiguedad from "@/components/GraficoPromedioAntiguedad";
import GraficoPromedioCancelacion from "@/components/GraficoPromedioCancelacion";
import GraficoRiesgoCancelacion from "@/components/GraficoRiesgoCancelacion";
import { useState, useEffect } from "react";
import ResumenCard from "@/components/ResumenCard";
import { FileText, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import TablaClientesRiesgo from "@/components/TablaClientesEnRiesgoDeCancelacion";
import GraficoTopRazonesChurn from "@/components/GraficoRazonesChurn";
import Navbar from "@/components/NavBar";
import { prediccionService } from "@/services/prediccionService";


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
    const fetchResumen = async () => {
      try {
        const data = await prediccionService.obtenerResumen();
        setResumen(data);
      } catch (error) {
        console.error("Error cargando resumen:", error);
      }
    };
    fetchResumen();
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
            <GraficoPromedioCancelacion resumen={resumen}/>
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
"use client";

import { useEffect, useState } from "react";
import ConsultasTable from "@/components/ConsultasTable";
import ConsultaDetalleModal from"@/components/ConsultaDetalleModal";
// import { getConsultas, getConsultaDetalle, deleteConsulta } from "@/services/consultasService";

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultas();
  }, []);

  async function loadConsultas() {
    try {
      const data = await getConsultas();
      setConsultas(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDetalle(idConsulta) {
    setLoadingDetalle(true);
    const data = await getConsultaDetalle(idConsulta);
    console.log(`esta la data de la consulta de detalle ${data.idConsulta}`);
    setDetalle(data);
    setLoadingDetalle(false);
  }

  async function handleDelete(id) {
    const confirm = window.confirm(
      "¿Seguro que deseas eliminar esta consulta?"
    );
    if (!confirm) return;

    try {
      await deleteConsulta(id);
      setConsultas((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Error al eliminar la consulta");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Consultas Realizadas
      </h1>

      {loading ? (
        <p className="text-slate-500">Cargando consultas...</p>
      ) : (
        <ConsultasTable
          consultas={consultas}
          onDetalle={(id) => handleDetalle(id)}
          onDelete={handleDelete}
        />
      )}  

      {detalle && (
        <ConsultaDetalleModal
          consulta={detalle}
          loading={loadingDetalle}
          onClose={() => setDetalle(null)}
        />
      )}

    </div>
  );
}
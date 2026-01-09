"use client";

export default function ConsultasTable({ consultas = [], onDetalle, onDelete }) {
    
  return (
    <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">Fecha y Hora</th>
            <th className="px-4 py-3 text-left">Tiempo Suscripción</th>
            <th className="px-4 py-3 text-left">Prom. Factura</th>
            <th className="px-4 py-3 text-left">Fallas</th>
            <th className="px-4 py-3 text-left">Probabilidad</th>
            <th className="px-4 py-3 text-left">Riesgo</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
            {consultas.length === 0 ? (  
            <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                No hay consultas registradas
                </td>
            </tr>
            ) : (
            consultas.map((c) => (
                <tr key={c.id} className="border-t">
                <td className="px-4 py-3">
                    {new Date(c.fechaHora).toLocaleString()}
                </td>

                <td className="px-4 py-3">{c.tiempoSuscripcion} meses</td>
                <td className="px-4 py-3">${c.promedioFactura}</td>
                <td className="px-4 py-3">{c.fallasServicio}</td>
                <td className="px-4 py-3">
                    {(c.probabilidad * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3">
                    <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                        c.churn === "VA_A_CANCELAR"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                    {c.churn === "VA_A_CANCELAR"
                        ? "Va a cancelar"
                        : "Va a continuar"}
                    </span>
                </td>

                <td className="px-4 py-3 text-right space-x-2">
                    <button 
                    onClick={() => onDetalle(c.id)}
                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
                    Detalles
                    </button>

                    <button
                    onClick={() => onDelete(c.id)}
                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                    >
                    Eliminar
                    </button>
                </td>
                </tr>
            ))
            )}
        </tbody>
      </table>

      {consultas.length === 0 && (
        <div className="p-6 text-center text-slate-500">
          No hay consultas registradas
        </div>
      )}
    </div>
  );
}
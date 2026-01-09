export default function ConsultaDetalleModal({ consulta, loading, onClose }) {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl">
          Cargando detalle...
        </div>
      </div>
    );
  }

  const { datosEntrada } = consulta;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalle de la Consulta</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Resultado */}
        <div className="mb-4">
          <p className="text-sm text-slate-500">Resultado: </p>
          <p
            className={`font-semibold ${
              consulta.churn === "VA_A_CANCELAR"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {consulta.churn === "VA_A_CANCELAR"
              ? "Va a cancelar"
              : "Va a continuar"}
          </p>
          <p className="text-sm text-slate-600">
            Probabilidad: {(consulta.probabilidad * 100).toFixed(2)}%
          </p>
        </div>

        {/* Datos de entrada */}
        <div className="border-t pt-4 mb-4 space-y-2 text-sm">
          <p><b>Tiempo suscripción:</b> {consulta.datosEntrada.tiempoDeSuscripcion} meses</p>
          <p><b>Promedio factura:</b> ${consulta.datosEntrada.promedioFactura}</p>
          <p><b>Contrato restante:</b> {consulta.datosEntrada.contratoRestante} meses</p>
          <p><b>Fallas servicio:</b> {consulta.datosEntrada.fallasServicio}</p>
          <p><b>Descarga sobre límite:</b> {consulta.datosEntrada.descargaSobreLimite ? "Sí" : "No"}</p>
          <p><b>Streaming:</b> {consulta.datosEntrada.suscriptorStreaming ? "Sí" : "No"}</p>
          <p><b>Paquete películas:</b> {consulta.datosEntrada.paquetePeliculas ? "Sí" : "No"}</p>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
            <p><b>Estado:</b> {consulta.estado}</p>
        </div>
        {/* Footer */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
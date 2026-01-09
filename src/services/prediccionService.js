import apiClient from "./api";

const PREDICCION_BASE_URL = "predicciones";

export const prediccionService = {
    // POST: Predecir churn
    predecir: async (data) => {
        const response = await apiClient.post(`${PREDICCION_BASE_URL}/predecir`, data);
        return response.data;
    },

    // GET: historial de predicciones
    traerHistorial: async (params) => {
        const response = await apiClient.get(`${PREDICCION_BASE_URL}`, { params });
        return response.data;
    },

    // GET: resumen estadísticas
    obtenerResumen: async () => {
        const response = await apiClient.get(`${PREDICCION_BASE_URL}/resumen`);
        return response.data;
    },

    // POST: cargar csv
    cargarCSV: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post(`${PREDICCION_BASE_URL}/cargar-csv`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    // GET: Antiguedad info del mes actual
    obtenerAntiguedadMesActual: async () => 
    {
        const response = await apiClient.get(
            `${PREDICCION_BASE_URL}/antiguedad/mes-actual`
        )
        return response.data;
    },

    // GET: cancelacion mensual de los ultimos 6 meses
    obtenerCancelacionMensual: async () => 
    {
        const response = await apiClient.get(
            `${PREDICCION_BASE_URL}/cancelacion/mensual`
        )
        return response.data;
    },

    // GET: ranking de clientes riesgo
    obtenerRankingRiesgo: async (page = 0, size = 10) => {
        const response = await apiClient.get(
        `${PREDICCION_BASE_URL}/ranking-riesgo`,
        { params: { page, size } }
        );
        return response.data;
    },

    // GET: ranking de clientes riesgo
    obtenerTopRazonesChurn: async () => {
        const response = await apiClient.get(
        `${PREDICCION_BASE_URL}/churn/razones`
        );

        return response.data;
    }

};
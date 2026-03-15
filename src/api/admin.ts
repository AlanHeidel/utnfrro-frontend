import { api } from "./api";

function unwrapData(payload: any) {
  return payload?.data ?? payload ?? {};
}

export async function getPedidosHoyMetric() {
  const { data } = await api.get("/api/admin/metricas/pedidos-hoy");
  return unwrapData(data);
}

export async function getIngresosHoyMetric() {
  const { data } = await api.get("/api/admin/metricas/ingresos-hoy");
  return unwrapData(data);
}

export async function getMesasOcupadasMetric() {
  const { data } = await api.get("/api/admin/metricas/mesas-ocupadas");
  return unwrapData(data);
}

export async function getCuentasUsuariosMetric() {
  const { data } = await api.get("/api/admin/metricas/cuentas-usuarios");
  return unwrapData(data);
}

export async function getDashboardMensual(month?: string) {
  const { data } = await api.get("/api/admin/dashboard/mensual", {
    params: month ? { month } : undefined,
  });
  return unwrapData(data);
}

export async function getTopProductosDashboard(
  month?: string,
  limit: number = 4,
) {
  const params = {
    limit: Math.max(1, Math.min(20, Number(limit) || 4)),
    ...(month ? { month } : {}),
  };
  const { data } = await api.get("/api/admin/dashboard/top-productos", {
    params,
  });
  return {
    month: data?.month ?? month,
    limit: data?.limit ?? params.limit,
    data: Array.isArray(data?.data) ? data.data : [],
  };
}

export async function getDashboardObjetivos(month?: string) {
  const { data } = await api.get("/api/admin/dashboard/objetivos", {
    params: month ? { month } : undefined,
  });
  return unwrapData(data);
}

export async function updateDashboardObjetivos(
  payload: {
    salesTarget?: number;
    ordersTarget?: number;
    maxCanceledTarget?: number;
  },
  month?: string,
) {
  const { data } = await api.put("/api/admin/dashboard/objetivos", payload, {
    params: month ? { month } : undefined,
  });
  return unwrapData(data);
}

import { api } from "./api";

export async function createMozoCall() {
  const { data } = await api.post("/api/notifications/table/mozo-call");
  return data?.data ?? data;
}

export async function getNotifications({
  estado,
  mesaId,
  limit = 500,
}: {
  estado?: string;
  mesaId?: number | string;
  limit?: number;
} = {}) {
  const params: Record<string, string | number> = {};
  if (estado) params.estado = estado;
  if (mesaId !== undefined && mesaId !== null && mesaId !== "") {
    params.mesaId = mesaId;
  }
  if (limit) params.limit = limit;

  const { data } = await api.get("/api/notifications", { params });
  return Array.isArray(data?.data) ? data.data : [];
}

export async function updateNotificationEstado(
  id: number | string,
  estado: "pending" | "attended" | "canceled",
) {
  const { data } = await api.patch(`/api/notifications/${id}/estado`, { estado });
  return data?.data ?? data;
}

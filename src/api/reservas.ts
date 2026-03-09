import { api } from "./api";

export interface ReservaPayload {
  mesaId: number;
  inicio: string;
  observacion?: string;
}

function unwrap(data: any) {
  if (Array.isArray(data)) return data;
  return data?.data ?? data;
}

export async function getReservas() {
  const { data } = await api.get("/api/reservas");
  const payload = unwrap(data);
  return Array.isArray(payload) ? payload : [];
}

export async function getDisponibilidad(fecha: string, personas: number) {
  const { data } = await api.get("/api/reservas/disponibilidad", {
    params: { fecha, personas },
  });
  return unwrap(data);
}

export async function createReserva(payload: ReservaPayload) {
  const { data } = await api.post("/api/reservas", payload);
  return unwrap(data);
}

export async function cancelReserva(id: number | string) {
  const { data } = await api.delete(`/api/reservas/${id}`);
  return unwrap(data);
}

export async function finalizeReserva(id: number | string) {
  const { data } = await api.patch(`/api/reservas/${id}/finalizar`);
  return unwrap(data);
}

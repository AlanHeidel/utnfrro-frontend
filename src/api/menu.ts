import { api } from "./api";

export interface PlatoDTO {
  id: string;
  nombre: string;
  precio: number;
  ingredientes: string[];
  tipoPlato: string;
  imagen: string;
}

export interface CreatePlatoPayload {
  nombre: string;
  precio: number;
  ingredientes: string[];
  tipoPlato: string;
  imagen: string;
}

export interface UpdatePlatoPayload extends Partial<CreatePlatoPayload> {
  id: string;
}

export async function getPlatos() {
  const { data } = await api.get("/api/platos");
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function createPlato(payload) {
  const { data } = await api.post("/api/platos", payload);
  return data;
}

export async function updatePlato(
  id: string,
  payload: UpdatePlatoPayload
): Promise<PlatoDTO> {
  const { data } = await api.put<PlatoDTO>(`/api/platos/${id}`, payload);
  return data;
}

export async function deletePlato(id: string): Promise<void> {
  await api.delete(`/api/platos/${id}`);
}

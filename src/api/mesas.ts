import { api } from "./api";

export interface MesaDTO {
    id: number;
    numeroMesa: number;
    capacidad: number;
    lugar: string;
    estado: string;
    mozo: { id: number; nombre: string; apellido: string };
}

export interface MesaPayload {
    numeroMesa: number;
    capacidad: number;
    lugar: string;
    estado: string;
    mozoId: number;
}

export async function getMesas() {
    const { data } = await api.get("/api/mesas");
    return Array.isArray(data) ? data : data.data ?? [];
}

export async function createMesa(payload: MesaPayload) {
    const { data } = await api.post("/api/mesas", payload);
    return data.data ?? data;
}

export async function updateMesa(id: number | string, payload: MesaPayload) {
    const { data } = await api.put(`/api/mesas/${id}`, payload);
    return data.data ?? data;
}

export async function deleteMesa(id: number | string) {
    await api.delete(`/api/mesas/${id}`);
}

export async function getMozos() {
    const { data } = await api.get("/api/mozos"); return data.data ?? data;
}
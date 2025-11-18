import { api } from "./api";

export interface MozoDTO {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
}

export interface MozoPayload {
    nombre: string;
    apellido: string;
    dni: string;
}

export async function getMozos() {
    const { data } = await api.get("/api/mozos");
    return Array.isArray(data) ? data : data.data ?? [];
}

export async function createMozo(payload: MozoPayload) {
    const { data } = await api.post("/api/mozos", payload);
    return data.data ?? data;
}

export async function updateMozo(id: number | string, payload: MozoPayload) {
    const { data } = await api.put(`/api/mozos/${id}`, payload);
    return data.data ?? data;
}

export async function deleteMozo(id: number | string) {
    await api.delete(`/api/mozos/${id}`);
}
import { api } from "./api";

export interface PedidoItemInput {
    platoId: number | string;
    cantidad: number;
}

export interface CreatePedidoPayload {
    items: PedidoItemInput[];
    nota?: string;
}

export interface PedidoDTO {
    id: number;
    estado: "pending" | "in_progress" | "delivered" | "canceled";
    total: number;
    fechaHora: string;
    mesa: {
        id: number;
        numeroMesa: number;
        estado: string;
    };
    items: Array<{
        id: number;
        cantidad: number;
        precioUnitario: number;
        plato: {
            id: number;
            nombre: string;
            precio: number;
        };
    }>;
}

function normalizePedidoListResponse(payload: any): PedidoDTO[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
}

export async function createPedidoFromTable(
  payload: CreatePedidoPayload
): Promise<PedidoDTO> {
  const { data } = await api.post("/api/pedidos/table", payload);
  return data.data ?? data;
}

export async function getPedidoById(id: number | string): Promise<PedidoDTO> {
  const { data } = await api.get(`/api/pedidos/${id}`);
  return data.data ?? data;
}

export async function getPedidos(): Promise<PedidoDTO[]> {
  const { data } = await api.get("/api/pedidos");
  const payload = Array.isArray(data) ? data : data.data;
  return Array.isArray(payload) ? payload : [];
}

export async function updatePedidoEstado(
  id: number | string,
  estado: PedidoDTO["estado"]
): Promise<PedidoDTO> {
  const { data } = await api.patch(`/api/pedidos/${id}/estado`, { estado });
  return data.data ?? data;
}

export async function getPedidoForTable(
  mesaId: number | string
): Promise<PedidoDTO[]> {
  const { data } = await api.get(`/api/pedidos/table/${mesaId}`);
  return normalizePedidoListResponse(data);
}

export async function getPedidosRecibidosForTable(
  mesaId: number | string
): Promise<PedidoDTO[]> {
  const { data } = await api.get(`/api/pedidos/table/${mesaId}/recibidos`);
  return normalizePedidoListResponse(data);
}

export async function getPedidosEnCocinaForTable(
  mesaId: number | string
): Promise<PedidoDTO[]> {
  const { data } = await api.get(`/api/pedidos/table/${mesaId}/en-cocina`);
  return normalizePedidoListResponse(data);
}

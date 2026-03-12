import { api } from "./api";

export interface TablePaymentPreferenceItemInput {
  platoId: number | string;
  cantidad: number;
}

export interface CreateTablePaymentPreferencePayload {
  items: TablePaymentPreferenceItemInput[];
}

export interface PaymentPreferenceData {
  preferenceId: string;
  initPoint: string;
}

export async function createTablePaymentPreference(
  payload: CreateTablePaymentPreferencePayload
) {
  const { data } = await api.post("/api/payments/table/preference", payload);
  return data.data ?? data;
}

function normalizePaymentPreferenceResponse(payload: any): PaymentPreferenceData {
  const data = payload?.data ?? payload ?? {};
  const preference = data?.preference ?? data?.paymentPreference ?? {};

  const preferenceId = String(
    data?.preferenceId ??
      data?.preference_id ??
      preference?.id ??
      preference?.preferenceId ??
      preference?.preference_id ??
      ""
  ).trim();

  const initPoint = String(
    data?.initPoint ??
      data?.init_point ??
      preference?.initPoint ??
      preference?.init_point ??
      ""
  ).trim();

  return { preferenceId, initPoint };
}

export async function recoverPedidoPaymentPreference(
  pedidoId: number | string
): Promise<PaymentPreferenceData> {
  const { data } = await api.post(
    `/api/payments/table/pedidos/${pedidoId}/preference`
  );
  return normalizePaymentPreferenceResponse(data);
}

export async function confirmTablePayment(paymentId: number | string) {
  const { data } = await api.post("/api/payments/table/confirm", {
    paymentId: String(paymentId),
  });
  return data.data ?? data;
}

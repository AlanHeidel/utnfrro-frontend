import { api } from "./api";

export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    type: "admin" | "client" | "table-device";
    data: any;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post("/api/accounts/login", payload);
    return data;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export async function registerClient(payload: RegisterPayload) {
    const { data } = await api.post("/api/accounts/register", payload);
    return data;
}

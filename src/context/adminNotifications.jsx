import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";
import {
  getNotifications,
  updateNotificationEstado,
} from "../api/notifications";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../hooks/useToast.jsx";
import { playNotificationSound } from "../utils/notificationSound.js";

const AdminNotificationsContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL?.trim() ?? "";
const SOCKET_URL = API_URL.replace(/\/api\/?$/i, "");

function normalizeStatus(value) {
  return String(value ?? "").trim().toLowerCase() || "pending";
}

function normalizeNotification(raw) {
  const mesa = raw?.mesa ?? {};
  const mesaId = mesa?.id ?? raw?.mesaId ?? null;
  const mesaNumero = mesa?.numeroMesa ?? raw?.mesaNumero ?? null;
  const estado = normalizeStatus(raw?.estado);
  const createdAt = raw?.createdAt ?? raw?.fechaHora ?? new Date().toISOString();
  const message =
    raw?.message ??
    (mesaNumero
      ? `Mesa ${mesaNumero} solicita mozo`
      : "Una mesa solicita mozo");

  return {
    id: raw?.id?.toString?.() ?? String(raw?.id ?? crypto.randomUUID()),
    mesa: {
      id: mesaId,
      numeroMesa: mesaNumero,
    },
    estado,
    createdAt,
    message,
  };
}

function sortByNewest(items) {
  return [...items].sort((a, b) => {
    const byDate =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (!Number.isNaN(byDate) && byDate !== 0) return byDate;
    return Number(b.id) - Number(a.id);
  });
}

function upsertById(items, incoming) {
  return sortByNewest([
    incoming,
    ...items.filter((item) => String(item.id) !== String(incoming.id)),
  ]);
}

export function AdminNotificationsProvider({ children }) {
  const { token, type } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const refreshNotifications = useCallback(
    async (params = {}) => {
      if (type !== "admin") return;

      setLoading(true);
      setError("");

      try {
        const data = await getNotifications({ limit: 500, ...params });
        setNotifications(sortByNewest(data.map(normalizeNotification)));
      } catch {
        setError("No pudimos cargar las notificaciones.");
      } finally {
        setLoading(false);
      }
    },
    [type],
  );

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if (type !== "admin" || !token) return undefined;

    const socket = io(SOCKET_URL || undefined, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
    });

    const handleCreated = (payload) => {
      const normalized = normalizeNotification(payload);
      setNotifications((prev) => upsertById(prev, normalized));
      if (normalized.estado === "pending") {
        playNotificationSound();
        showToast(normalized.message, "info");
      }
    };

    const handleUpdated = (payload) => {
      const normalized = normalizeNotification(payload);
      setNotifications((prev) => upsertById(prev, normalized));
    };

    socket.on("realtime:ready", () => {});
    socket.on("notification:created", handleCreated);
    socket.on("notification:updated", handleUpdated);

    return () => {
      socket.off("notification:created", handleCreated);
      socket.off("notification:updated", handleUpdated);
      socket.disconnect();
    };
  }, [token, type, showToast]);

  const updateStatus = useCallback(
    async (id, estado) => {
      setUpdatingId(String(id));
      try {
        const updated = await updateNotificationEstado(id, estado);
        const normalized = normalizeNotification(updated);
        setNotifications((prev) => upsertById(prev, normalized));
        showToast(
          estado === "attended"
            ? "Notificación marcada como atendida"
            : "Notificación cancelada",
          "success",
        );
      } catch {
        showToast("No pudimos actualizar la notificación.", "error");
      } finally {
        setUpdatingId(null);
      }
    },
    [showToast],
  );

  const pendingCount = useMemo(
    () =>
      notifications.filter((notification) => notification.estado === "pending")
        .length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      pendingCount,
      loading,
      error,
      updatingId,
      refreshNotifications,
      updateStatus,
    }),
    [
      notifications,
      pendingCount,
      loading,
      error,
      updatingId,
      refreshNotifications,
      updateStatus,
    ],
  );

  return (
    <AdminNotificationsContext.Provider value={value}>
      {children}
    </AdminNotificationsContext.Provider>
  );
}

export function useAdminNotificationsContext() {
  const context = useContext(AdminNotificationsContext);
  if (!context) {
    throw new Error(
      "useAdminNotificationsContext debe usarse dentro de AdminNotificationsProvider",
    );
  }
  return context;
}

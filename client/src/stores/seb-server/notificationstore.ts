import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type AlertKind =
    | "success"
    | "info"
    | "warning"
    | "client-error"
    | "server-error";

export interface AlertInput {
    type: AlertKind;
    title?: string;
    text?: string;
    duration?: number;
    actionLabel?: string;
    onAction?: () => void;
    dedupeKey?: string;
}

export interface Alert extends Required<Omit<AlertInput, "onAction">> {
    id: string;
    onAction?: () => void;
    createdAt: number;
}

const DEFAULT_DURATION = 10_000;
const MAX_VISIBLE = 4;
const DEDUPE_WINDOW_MS = 4_000;

export const useNotificationsStore = defineStore("notifications", () => {
    const alerts = ref<Alert[]>([]);

    const ordered = computed(() =>
        [...alerts.value].sort((a, b) => b.createdAt - a.createdAt),
    );

    const visible = computed(() => ordered.value.slice(0, MAX_VISIBLE));
    const queued = computed(() => ordered.value.slice(MAX_VISIBLE));

    function remove(id: string) {
        alerts.value = alerts.value.filter((a) => a.id !== id);
    }

    function clearAll() {
        alerts.value = [];
    }

    function add(input: AlertInput): string {
        const id = crypto.randomUUID();
        const now = Date.now();

        if (input.dedupeKey) {
            const existing = alerts.value.find(
                (a) =>
                    a.dedupeKey === input.dedupeKey &&
                    now - a.createdAt < DEDUPE_WINDOW_MS,
            );
            if (existing) return existing.id;
        }

        alerts.value.unshift({
            id,
            type: input.type,
            title: input.title ?? "",
            text: input.text ?? "",
            duration: input.duration ?? DEFAULT_DURATION,
            actionLabel: input.actionLabel ?? "",
            onAction: input.onAction,
            dedupeKey: input.dedupeKey ?? "",
            createdAt: now,
        });

        const HARD_CAP = 20;
        if (alerts.value.length > HARD_CAP) {
            alerts.value = alerts.value.slice(0, HARD_CAP);
        }

        return id;
    }

    const success = (
        title: string,
        text?: string,
        opts?: Partial<AlertInput>,
    ) => add({ type: "success", title, text, ...opts });
    const info = (title: string, text?: string, opts?: Partial<AlertInput>) =>
        add({ type: "info", title, text, ...opts });
    const warning = (
        title: string,
        text?: string,
        opts?: Partial<AlertInput>,
    ) => add({ type: "warning", title, text, ...opts });
    const clientError = (
        title: string,
        text?: string,
        opts?: Partial<AlertInput>,
    ) => add({ type: "client-error", title, text, ...opts });
    const serverError = (
        title: string,
        text?: string,
        opts?: Partial<AlertInput>,
    ) => add({ type: "server-error", title, text, ...opts });

    return {
        alerts,
        visible,
        queued,
        add,
        remove,
        clearAll,
        success,
        info,
        warning,
        clientError,
        serverError,
    };
});

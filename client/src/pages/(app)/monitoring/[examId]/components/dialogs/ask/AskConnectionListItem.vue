<template>
    <v-card
        variant="flat"
        link
        border
        rounded="lg"
        hover
        class="px-3 py-2"
        role="link"
        tabindex="0"
        :aria-label="ariaLabel"
        @click="emit('show')"
        @keydown="handleActivate"
    >
        <div class="d-flex align-center ga-2">
            <div class="flex-grow-1" style="min-width: 0">
                <div class="text-body-medium font-weight-medium text-truncate">
                    {{ connection.name || `Connection ${connection.id}` }}
                </div>
                <div class="text-body-small text-medium-emphasis text-truncate">
                    SEB: {{ connection.conn?.clientVersion || "—" }} -
                    {{ connection.conn?.clientOsName || "—" }} - IP:
                    {{ connection.conn?.clientAddress || "—" }}
                </div>
            </div>

            <v-chip
                :color="statusColor"
                size="x-small"
                variant="tonal"
                class="text-uppercase flex-shrink-0"
            >
                {{ connection.conn?.status || "UNKNOWN" }}
            </v-chip>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";

import { AskConnectionEntry } from "./types.ts";

const props = defineProps<{
    connection: AskConnectionEntry;
}>();

const emit = defineEmits<{
    show: [];
}>();

const statusColor = computed(() => {
    const status = (props.connection.conn?.status ?? "").toUpperCase();
    if (
        status === ConnectionStatusEnum.ACTIVE ||
        status === ConnectionStatusEnum.READY
    ) {
        return "success";
    }
    return "grey";
});

const ariaLabel = computed(() => {
    const c = props.connection;
    const name = c.name || `Connection ${c.id}`;
    const status = c.conn?.status || "UNKNOWN";
    const seb = c.conn?.clientVersion ? `SEB ${c.conn.clientVersion}` : "";
    const os = c.conn?.clientOsName ?? "";
    const ip = c.conn?.clientAddress ? `IP ${c.conn.clientAddress}` : "";
    return [name, status, seb, os, ip].filter(Boolean).join(", ");
});

function handleActivate(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }
    event.preventDefault();
    emit("show");
}
</script>

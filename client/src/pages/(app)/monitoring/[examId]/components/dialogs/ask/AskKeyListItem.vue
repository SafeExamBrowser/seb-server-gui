<template>
    <v-card
        :color="selected ? 'surface-tint' : 'surface'"
        variant="flat"
        link
        border
        rounded="lg"
        hover
        class="pa-3"
        role="button"
        tabindex="0"
        :aria-pressed="selected"
        :aria-label="ariaLabel"
        @click="emit('select')"
        @keydown="handleActivate"
    >
        <div class="d-flex align-center justify-space-between ga-2 mb-3">
            <v-chip
                :color="ask.tag ? 'success' : undefined"
                variant="tonal"
                size="small"
            >
                {{
                    ask.tag
                        ? $t("monitoringDetails.monitoringASKDialog.granted")
                        : $t("monitoringDetails.monitoringASKDialog.notGranted")
                }}
            </v-chip>

            <v-chip variant="tonal" size="small">
                {{ ask.entries.length }}
                {{ $t("monitoringDetails.monitoringASKDialog.connections") }}
            </v-chip>
        </div>

        <v-sheet
            color="background"
            border
            rounded
            class="ask-hash text-body-small font-weight-bold pa-2 mb-3"
            :title="ask.keyValue"
        >
            {{ ask.keyValue }}
        </v-sheet>

        <AskKeyMeta :seb-version="ask.sebVersion" :os-name="ask.osName" />
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AskKeyMeta from "./AskKeyMeta.vue";
import { EnrichedAsk } from "./types.ts";

const props = withDefaults(
    defineProps<{
        ask: EnrichedAsk;
        selected?: boolean;
    }>(),
    { selected: false },
);

const emit = defineEmits<{
    select: [];
}>();

const { t } = useI18n();

const ariaLabel = computed(() => {
    const status = props.ask.tag
        ? t("monitoringDetails.monitoringASKDialog.granted")
        : t("monitoringDetails.monitoringASKDialog.notGranted");
    const connections = `${props.ask.entries.length} ${t(
        "monitoringDetails.monitoringASKDialog.connections",
    )}`;
    const seb = props.ask.sebVersion ? `SEB ${props.ask.sebVersion}` : "";
    // Append a short hash fragment so otherwise-identical keys are distinguishable.
    const keyTail = props.ask.keyValue
        ? `key ${props.ask.keyValue.slice(-8)}`
        : "";
    return [status, connections, seb, props.ask.osName, keyTail]
        .filter(Boolean)
        .join(", ");
});

function handleActivate(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }
    event.preventDefault();
    emit("select");
}
</script>

<style scoped>
/* Monospaced, wrapping hash — no Vuetify utility exists for these. */
.ask-hash {
    font-family: monospace;
    word-break: break-all;
    line-height: 1.3;
}
</style>

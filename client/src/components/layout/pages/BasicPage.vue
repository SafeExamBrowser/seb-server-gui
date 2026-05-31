<template>
    <div class="fill-height d-flex flex-column">
        <div v-if="$slots.PanelTop" class="flex-shrink-0 mb-4">
            <v-card elevation="2" rounded="lg">
                <slot name="PanelTop"></slot>
            </v-card>
        </div>

        <div class="flex-grow-1 d-flex" :style="{ minHeight: 0 }">
            <div
                v-if="$slots.PanelLeft"
                class="flex-shrink-0 h-100 overflow-hidden"
                :style="panelLeftStyle"
            >
                <div class="h-100" :style="{ width: PANEL_LEFT_WIDTH }">
                    <slot name="PanelLeft"></slot>
                </div>
            </div>

            <div class="flex-grow-1 h-100" :style="{ minWidth: 0 }">
                <v-card
                    elevation="2"
                    rounded="lg"
                    class="h-100 d-flex flex-column overflow-hidden"
                >
                    <PageHeader
                        :title="title"
                        :bread-crumb="breadCrumb"
                        :data-test-id="dataTestId"
                    >
                        <template v-if="$slots.ActionButton" #actions>
                            <slot name="ActionButton"></slot>
                        </template>
                    </PageHeader>

                    <div
                        class="flex-grow-1 overflow-y-auto"
                        :style="{ minHeight: 0 }"
                    >
                        <slot name="PanelMain"></slot>
                    </div>
                </v-card>
            </div>

            <div
                v-if="$slots.PanelAside"
                class="flex-shrink-0 h-100 ms-4"
                :style="{ width: PANEL_ASIDE_WIDTH }"
            >
                <v-card
                    elevation="2"
                    rounded="lg"
                    class="h-100 overflow-y-auto"
                >
                    <slot name="PanelAside"></slot>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import PageHeader from "@/components/layout/pages/components/PageHeader.vue";
import { BreadCrumbItem } from "@/components/widgets/breadCrumb/types";

const props = withDefaults(
    defineProps<{
        title: string;
        breadCrumb?: BreadCrumbItem[];
        dataTestId?: string;
        panelLeftCollapsed?: boolean;
    }>(),
    {
        breadCrumb: undefined,
        dataTestId: undefined,
        panelLeftCollapsed: false,
    },
);

const PANEL_LEFT_WIDTH = "300px";
const PANEL_ASIDE_WIDTH = "340px";

// Collapses the left panel by animating its width (and the gap) to zero, the
// way the design's filter column slides away. A fixed-width inner wrapper keeps
// the content from reflowing while the outer element shrinks.
const panelLeftStyle = computed<CSSProperties>(() => ({
    width: props.panelLeftCollapsed ? "0px" : PANEL_LEFT_WIDTH,
    marginRight: props.panelLeftCollapsed ? "0px" : "16px",
    opacity: props.panelLeftCollapsed ? 0 : 1,
    pointerEvents: props.panelLeftCollapsed ? "none" : "auto",
    transition:
        "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease",
}));
</script>

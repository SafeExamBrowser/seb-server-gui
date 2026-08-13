<template>
    <div class="fill-height d-flex flex-column">
        <div v-if="$slots.SubNav" class="flex-shrink-0 mb-4">
            <slot name="SubNav"></slot>
        </div>
        <div v-if="$slots.PanelTop" class="flex-shrink-0 mb-4">
            <v-card border elevation="1" rounded="lg">
                <slot name="PanelTop"></slot>
            </v-card>
        </div>

        <div class="flex-grow-1 d-flex" :style="{ minHeight: 0 }">
            <v-card
                v-if="$slots.PanelLeft"
                border
                elevation="1"
                rounded="lg"
                class="flex-shrink-0 h-100 overflow-hidden"
                :style="panelLeftStyle"
            >
                <div class="h-100" :style="{ width: PANEL_LEFT_WIDTH }">
                    <slot name="PanelLeft"></slot>
                </div>
            </v-card>

            <div
                v-if="floating"
                ref="floatingScrollerEl"
                class="flex-grow-1 overflow-y-auto overflow-x-hidden px-3 mx-n3 d-flex flex-column"
                :class="isScrolledToEnd ? 'pb-3 mb-n3' : ''"
                :style="{ minWidth: 0, minHeight: 0 }"
                @scroll.passive="handleFloatingScroll"
            >
                <v-card
                    border
                    elevation="1"
                    rounded="lg"
                    class="bg-surface-tint mb-6 pb-4 flex-shrink-0"
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
                </v-card>

                <slot name="PanelMain"></slot>

                <div
                    ref="floatingScrollEndSentinelEl"
                    class="flex-shrink-0"
                    :style="{ height: '1px', marginTop: '-1px' }"
                />
            </div>

            <div v-else class="flex-grow-1 h-100" :style="{ minWidth: 0 }">
                <v-card
                    border
                    elevation="1"
                    rounded="lg"
                    class="h-100 d-flex flex-column overflow-hidden"
                >
                    <PageHeader
                        class="bg-surface-tint pb-4"
                        :title="title"
                        :bread-crumb="breadCrumb"
                        :data-test-id="dataTestId"
                    >
                        <template v-if="$slots.ActionButton" #actions>
                            <slot name="ActionButton"></slot>
                        </template>
                    </PageHeader>
                    <v-divider :thickness="2" />

                    <div
                        class="flex-grow-1 overflow-y-auto"
                        :style="{ minHeight: 0 }"
                    >
                        <slot name="PanelMain"></slot>
                    </div>

                    <template v-if="$slots.PanelFooter">
                        <v-divider :thickness="2" />
                        <div class="flex-shrink-0 bg-surface-tint">
                            <slot name="PanelFooter"></slot>
                        </div>
                    </template>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    type CSSProperties,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";
import { VCard, VDivider } from "vuetify/components";

import PageHeader from "@/components/layout/pages/components/PageHeader.vue";
import { BreadCrumbItem } from "@/components/widgets/breadCrumb/types";

const props = withDefaults(
    defineProps<{
        title: string;
        breadCrumb?: BreadCrumbItem[];
        dataTestId?: string;
        panelLeftCollapsed?: boolean;
        floating?: boolean;
    }>(),
    {
        breadCrumb: undefined,
        dataTestId: undefined,
        panelLeftCollapsed: false,
        floating: false,
    },
);

const PANEL_LEFT_WIDTH = "300px";

const floatingScrollerEl = ref<HTMLElement>();
const floatingScrollEndSentinelEl = ref<HTMLElement>();
const isScrolledToEnd = ref(false);

function updateIsScrolledToEnd() {
    const el = floatingScrollerEl.value;
    if (el == null) {
        return;
    }

    isScrolledToEnd.value =
        el.scrollHeight - el.clientHeight - el.scrollTop < 1;
}

function handleFloatingScroll() {
    updateIsScrolledToEnd();
}

let scrollEndObserver: IntersectionObserver | undefined;

function bindScrollEndObserver() {
    scrollEndObserver?.disconnect();
    scrollEndObserver = undefined;

    const el = floatingScrollerEl.value;
    const sentinel = floatingScrollEndSentinelEl.value;
    if (el == null || sentinel == null) {
        return;
    }

    scrollEndObserver = new IntersectionObserver(updateIsScrolledToEnd, {
        root: el,
        rootMargin: isScrolledToEnd.value ? "0px 0px -12px 0px" : "0px",
    });
    scrollEndObserver.observe(sentinel);
}

onMounted(bindScrollEndObserver);
watch(isScrolledToEnd, bindScrollEndObserver);

onBeforeUnmount(() => {
    scrollEndObserver?.disconnect();
});

const panelLeftStyle = computed<CSSProperties>(() => ({
    width: props.panelLeftCollapsed ? "0px" : PANEL_LEFT_WIDTH,
    marginRight: props.panelLeftCollapsed ? "0px" : "16px",
    opacity: props.panelLeftCollapsed ? 0 : 1,
    pointerEvents: props.panelLeftCollapsed ? "none" : "auto",
    transition:
        "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease",
}));
</script>

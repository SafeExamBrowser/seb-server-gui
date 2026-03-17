<template>
    <template v-if="visible">
        <v-divider
            :class="['section-divider', { 'thick-divider': thickDivider }]"
        />

        <v-list-item class="px-0 nav-hover">
            <router-link
                v-if="to"
                class="link-color nav-link"
                :data-testid="testId"
                :to="to"
            >
                {{ label }}
            </router-link>

            <span v-else class="link-color nav-link" :data-testid="testId">
                {{ label }}
            </span>
        </v-list-item>
    </template>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        testId?: string;
        to?: string;
        visible?: boolean;
        thickDivider?: boolean;
    }>(),
    {
        visible: true,
        thickDivider: false,
        testId: undefined,
        to: undefined,
    },
);
</script>

<style scoped>
.nav-hover:hover .nav-link {
    color: #215caf;
}

.nav-link {
    transition: color 0.4s ease;
    margin-left: 10px;
}

.nav-hover {
    transition: background 0.4s ease;
    border-radius: 4px;
    background: transparent;
    padding-left: 8px;
    width: 85% !important;
}

.nav-hover:hover {
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.98) 10%,
        rgba(255, 255, 255, 0.96) 20%,
        rgba(255, 255, 255, 0.93) 25%,
        rgba(255, 255, 255, 0.9) 30%,
        rgba(255, 255, 255, 0.86) 40%,
        rgba(255, 255, 255, 0.8) 60%,
        rgba(255, 255, 255, 0.7) 68%,
        rgba(255, 255, 255, 0.6) 75%,
        rgba(255, 255, 255, 0.45) 82%,
        rgba(33, 92, 175, 0.2) 88%,
        rgba(33, 92, 175, 0.12) 92%,
        rgba(33, 92, 175, 0.08) 96%,
        rgba(33, 92, 175, 0.04) 98%,
        rgba(33, 92, 175, 0.01) 99%,
        rgba(33, 92, 175, 0) 100%
    );
}

.link-color {
    color: white;
    text-decoration: none;
}

.section-divider {
    background-color: white !important;
    height: 1px !important;
    opacity: 1 !important;
    width: 85% !important;
}

.thick-divider {
    border-top-width: 2px !important;
}
</style>

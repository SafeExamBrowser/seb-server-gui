<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="mb-3">
                    <h3 class="text-h6 font-weight-bold mb-1">
                        {{ title }}
                    </h3>
                    <div class="text-body-2">
                        {{ subtitle }}
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <slot></slot>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    subtitle: string;
}>();
</script>

<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                :text="examTemplate?.name"
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeExamTemplateDialog')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <div
                v-if="
                    examTemplate != null &&
                    examTemplate.description != null &&
                    examTemplate.description != ''
                "
            >
                {{ examTemplate?.description }}
            </div>
            <div v-else>
                <!-- No Description available -->
                -
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";

defineProps<{
    examTemplate: ExamTemplate | null;
}>();

const emit = defineEmits<{
    closeExamTemplateDialog: [];
}>();
</script>

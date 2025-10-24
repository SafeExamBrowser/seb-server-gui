<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="title"></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeDeleteDialog')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    {{ infoText }}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="font-weight-bold">
                    {{ questionText }}
                </v-col>
            </v-row>

            <v-row>
                <v-col align="right">
                    <v-btn
                        color="black"
                        rounded="sm"
                        variant="outlined"
                        @click="emit('closeDeleteDialog')"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        class="ml-2"
                        color="error"
                        rounded="sm"
                        variant="flat"
                        @click="callDelete()"
                    >
                        Delete
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
// emits
const emit = defineEmits<{
    closeDeleteDialog: [];
    deleteFunction: [entityId?: string];
}>();

// props
const props = defineProps<{
    title: string;
    infoText: string;
    questionText: string;
    entityId?: string | null;
}>();

async function callDelete() {
    if (props.entityId) {
        emit("deleteFunction", props.entityId);
        return;
    }

    emit("deleteFunction");
}
</script>

<style scoped></style>

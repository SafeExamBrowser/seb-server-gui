<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Edit Application and Network Settings"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeSebSettingsDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>

            <v-tabs v-model="tab" align-tabs="center" color="primary">
                <v-tab :value="1">Landscape</v-tab>
                <v-tab :value="2">City</v-tab>
                <v-tab :value="3">Abstract</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item v-for="n in 3" :key="n" :value="n">
                    <v-container fluid>
                        <v-row>
                            <v-col v-for="i in 6" :key="i" cols="12" md="4">
                                <v-img :lazy-src="`https://picsum.photos/10/6?image=${i * n * 5 + 10}`"
                                    :src="`https://picsum.photos/500/300?image=${i * n * 5 + 10}`" height="205"
                                    cover></v-img>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tabs-window-item>
            </v-tabs-window>






        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">

    // const props = defineProps<{
    //     examTemplate: ExamTemplate | null
    // }>();

    const emit = defineEmits<{
        closeSebSettingsDialog: any,
    }>();

    const tab = ref();

</script>
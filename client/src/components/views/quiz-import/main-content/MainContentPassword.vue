<template>

    <v-row>
        <v-spacer></v-spacer>
        <v-col cols="4">
            <v-text-field
                :type="passwordVisible ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                placeholder="Password"
                variant="outlined"
                v-model="quizImportStore.selectedQuitPassword">

                <template v-slot:append-inner>
                    <v-btn
                        density="compact"
                        variant="text"
                        :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        @click="passwordVisible = !passwordVisible">
                    </v-btn>
                </template>

            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>


</template>


<script setup lang="ts">
    import { useQuizImportStore } from '@/stores/quizImportStore';


    //stores
    const quizImportStore = useQuizImportStore();

    //pw field
    const password = ref("");
    const passwordVisible = ref<boolean>(false);


</script>

<style scoped>


</style>
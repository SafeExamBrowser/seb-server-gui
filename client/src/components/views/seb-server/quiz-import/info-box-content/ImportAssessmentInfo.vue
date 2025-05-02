<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pl-4 pt-3 pr-4">

                <v-row 
                    class="fill-height"
                    align="center"
                    >

                    <v-col cols="5">
                        <div class="primary-text-color text-h5 font-weight-bold">
                            {{translate('quizImportWizard.assessmentTool.title')}}
                        </div>
                    </v-col>

                </v-row>

            </v-sheet>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {translate} from "@/utils/generalUtils";

</script>

<style scoped>
</style>
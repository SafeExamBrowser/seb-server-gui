<template>
    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">

                <v-row>
                    <v-col>
                        test
                    </v-col>
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import { VDateInput } from "vuetify/labs/VDateInput";
    import * as timeUtils from "@/utils/timeUtils";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";

    //i18n
    const i18n = useI18n();

    //stores
    const monitoringStore = useMonitoringStore();





</script>

<style scoped>


</style>
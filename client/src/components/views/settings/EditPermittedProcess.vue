<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="translate('examDetail.sebSettings.applicationView.permittedProcesses.editDialogTitle')"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeEditPermittedProcess', false)" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
           
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import { storeToRefs } from "pinia";
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import * as examViewService from "@/services/component-services/examViewService";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";


    //i18n
    const i18n = useI18n();

    //emits
    const emit = defineEmits<{
        closeEditPermittedProcess: any;
    }>();

    //props
    const props = defineProps<{
        permittedProcess: PermittedProcesess | null,
    }>();


</script>
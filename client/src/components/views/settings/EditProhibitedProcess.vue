<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="translate('examDetail.sebSettings.applicationView.prohibitedProcesses.editDialogTitle')"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeEditProhibitedProcess', false)" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!------------Create group form------------->
                <v-col>
                    <v-form>
                        <!------------ active ------------->
                        <v-row align="center">
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcesses.active_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.active")}}
                            </v-col>
                            <v-col><v-checkbox-btn v-model="props.prohibitedProcess!.active"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------OS Type------------->
                        <v-row align="center">
                            <v-col>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.os")}}
                            </v-col>
                            <v-col>
                                <v-select
                                    hide-details
                                    v-model="props.prohibitedProcess!.os"
                                    density="compact"
                                    variant="outlined"
                                    :items="osItems">
                                </v-select>
                            </v-col>
                        </v-row>
                        <!------------Executable------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcesses.executable_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.executable")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.prohibitedProcess!.executable"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Original Name------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcesses.originalName_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.originalName")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.prohibitedProcess!.originalName"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Description------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcesses.description_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.description")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.prohibitedProcess!.description"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Identifier------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcesses.identifier_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.identifier")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.prohibitedProcess!.identifier"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------ force quit ------------->
                        <v-row align="center">
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcesses.strongKill_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.strongKill")}}
                            </v-col>
                            <v-col><v-checkbox-btn v-model="props.prohibitedProcess!.strongKill"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ ignore AAC------------->
                        <v-row align="center">
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcesses.ignoreAAC_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.ignoreAAC")}}
                            </v-col>
                            <v-col><v-checkbox-btn v-model="props.prohibitedProcess!.ignoreInAAC"></v-checkbox-btn> </v-col>
                        </v-row>

                        <!------------Buttons------------->
                        <v-row align="center">
                            <v-col align="right">
                                <v-btn 
                                    rounded="sm" 
                                    color="black" 
                                    variant="outlined"
                                    @click="emit('closeEditProhibitedProcess', false)">
                                    {{translate("general.cancelButton")}}
                                </v-btn>
    
                                <v-btn 
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat" 
                                    class="ml-2"
                                    :disabled="isSaveButtonDisabled()"
                                    @click="emit('closeEditProhibitedProcess', true)">
                                    {{translate("general.saveButton")}}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
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
    import {translateWithBR} from "@/utils/generalUtils";


    //i18n
    const i18n = useI18n();

    //emits
    const emit = defineEmits<{
        closeEditProhibitedProcess: any;
    }>();

    //props
    const props = defineProps<{
        prohibitedProcess: ProhibitedProcesess | null,
    }>();

    const osItems = [ 
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.os_0"), value: "0" }, 
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.os_1"), value: "1" } ];

    function isSaveButtonDisabled() {
        return false;
    }

</script>

<style scoped>
    .css-fix {
        white-space: pre-wrap; /* or pre-line */
    }
</style>


  
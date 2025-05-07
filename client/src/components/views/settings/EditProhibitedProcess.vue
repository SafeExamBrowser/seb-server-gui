<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="translate('examDetail.sebSettings.applicationView.prohibitedProcess.editDialogTitle')"></v-toolbar-title>
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
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcess.active_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.active")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.prohibitedProcess!.active"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------OS Type------------->
                        <v-row align="center">
                            <v-col>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.os")}}
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
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcess.executable_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.executable")}}
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
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcess.originalName_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.originalName")}}
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
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcess.description_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.description")}}
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
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcess.identifier_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.identifier")}}
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
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcess.strongKill_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.strongKill")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.prohibitedProcess!.strongKill"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ ignore AAC------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.prohibitedProcess.ignoreAAC_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.prohibitedProcess.ignoreAAC")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.prohibitedProcess!.ignoreInAAC"></v-checkbox-btn> </v-col>
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
        prohibitedProcess: ProhibitedProcess | null,
        readOnly: boolean
    }>();

    const osItems = [ 
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcess.os_0"), value: "0" }, 
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcess.os_1"), value: "1" } ];

    function isSaveButtonDisabled() {
        return props.readOnly;
    }

</script>

<style scoped>
    .css-fix {
        white-space: pre-wrap; /* or pre-line */
    }
</style>


  
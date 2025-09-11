<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="translate('sebSettings.networkView.URLFilterRules.editDialogTitle')"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeEditURLFilterRule', false)" icon="mdi-close"></v-btn>
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
                                {{translate("sebSettings.networkView.URLFilterRules.active")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.urlFilterRule!.active" :disabled="props.readOnly"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------regex------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                {{translate("sebSettings.networkView.URLFilterRules.regex")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.urlFilterRule!.regex" :disabled="props.readOnly"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------Expression------------->
                        <v-row>
                            <v-col>
                                {{translate("sebSettings.networkView.URLFilterRules.expression")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.urlFilterRule!.expression"
                                    density="compact"
                                    variant="outlined"
                                    :disabled="props.readOnly">
                                </v-text-field>
                            </v-col>
                        </v-row>
                         <!------------Action------------->
                         <v-row align="center">
                            <v-col>
                                {{translate("sebSettings.networkView.URLFilterRules.action")}}
                            </v-col>
                            <v-col>
                                <v-select
                                    hide-details
                                    v-model="props.urlFilterRule!.action"
                                    density="compact"
                                    variant="outlined"
                                    :items="actionItems"
                                    :disabled="props.readOnly">
                                </v-select>
                            </v-col>
                        </v-row>

                        <!------------Buttons------------->
                        <v-row align="center">
                            <v-col align="right">
                                <v-btn 
                                    rounded="sm" 
                                    color="black" 
                                    variant="outlined"
                                    @click="emit('closeEditURLFilterRule', false)">
                                    {{translate("general.cancelButton")}}
                                </v-btn>
    
                                <v-btn 
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat" 
                                    class="ml-2"
                                    :disabled="props.readOnly"
                                    @click="emit('closeEditURLFilterRule', true)">
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
        closeEditURLFilterRule: any;
    }>();

    //props
    const props = defineProps<{
        urlFilterRule: URLFilterRule | null,
        readOnly: boolean
    }>();

    const actionItems = [ 
        {title: translate("sebSettings.networkView.URLFilterRules.action_0"), value: "0" }, 
        {title: translate("sebSettings.networkView.URLFilterRules.action_1"), value: "1" } ];


</script>

<style scoped>
    .css-fix {
        white-space: pre-wrap; /* or pre-line */
    }
</style>
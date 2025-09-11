<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                :text="
                    translate(
                        'sebSettings.networkView.URLFilterRules.editDialogTitle',
                    )
                "
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeEditURLFilterRule', false)"
                ></v-btn>
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
                                {{
                                    translate(
                                        "examDetail.sebSettings.networkView.URLFilterRules.active",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="props.urlFilterRule!.active"
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------regex------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                {{
                                    translate(
                                        "sebSettings.networkView.URLFilterRules.regex",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="props.urlFilterRule!.regex"
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------Expression------------->
                        <v-row>
                            <v-col>
                                {{
                                    translate(
                                        "sebSettings.networkView.URLFilterRules.expression",
                                    )
                                }}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="props.urlFilterRule!.expression"
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Action------------->
                        <v-row align="center">
                            <v-col>
                                {{
                                    translate(
                                        "sebSettings.networkView.URLFilterRules.action",
                                    )
                                }}
                            </v-col>
                            <v-col>
                                <v-select
                                    v-model="props.urlFilterRule!.action"
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    :items="actionItems"
                                    variant="outlined"
                                >
                                </v-select>
                            </v-col>
                        </v-row>

                        <!------------Buttons------------->
                        <v-row align="center">
                            <v-col align="right">
                                <v-btn
                                    color="black"
                                    rounded="sm"
                                    variant="outlined"
                                    @click="
                                        emit('closeEditURLFilterRule', false)
                                    "
                                >
                                    {{ translate("general.cancelButton") }}
                                </v-btn>

                                <v-btn
                                    class="ml-2"
                                    color="primary"
                                    :disabled="props.readOnly"
                                    rounded="sm"
                                    variant="flat"
                                    @click="
                                        emit('closeEditURLFilterRule', true)
                                    "
                                >
                                    {{ translate("general.saveButton") }}
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
import { translate } from "@/utils/generalUtils";

// emits
const emit = defineEmits<{
    closeEditURLFilterRule: any;
}>();

// props
const props = defineProps<{
    urlFilterRule: URLFilterRule | null;
    readOnly: boolean;
}>();

const actionItems = [
    {
        title: translate("sebSettings.networkView.URLFilterRules.action_0"),
        value: "0",
    },
    {
        title: translate("sebSettings.networkView.URLFilterRules.action_1"),
        value: "1",
    },
];
</script>

<style scoped>
.css-fix {
    white-space: pre-wrap; /* or pre-line */
}
</style>

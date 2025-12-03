<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                :text="
                    translate(
                        'sebSettings.updownloadView.filetypes.editDialogTitle',
                    )
                "
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeFileTypeDialog', false)"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!------------Create group form------------->
                <v-col>
                    <v-form>
                        <!------------ file extension ------------->
                        <v-row align="center">
                            <v-col>
                                <v-text-field
                                    v-model="props.fileType!.fileExtension"
                                    :label="
                                        translate(
                                            'sebSettings.updownloadView.ext',
                                        )
                                    "
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------ OS ------------->
                        <v-row align="center">
                            <v-col>
                                <v-select
                                    v-model="props.fileType!.os"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.updownloadView.os',
                                        )
                                    "
                                    :disabled="props.readOnly"
                                    hide-details
                                    :items="osItems"
                                    variant="outlined"
                                >
                                </v-select>
                            </v-col>
                        </v-row>
                        <!------------Identifier------------->
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model="props.fileType!.identifier"
                                    :label="
                                        translate(
                                            'sebSettings.updownloadView.id',
                                        )
                                    "
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <!------------Buttons------------->
                        <v-row align="center">
                            <v-col align="right">
                                <v-btn
                                    color="black"
                                    rounded="sm"
                                    variant="outlined"
                                    @click="emit('closeFileTypeDialog', false)"
                                >
                                    {{ translate("general.cancelButton") }}
                                </v-btn>

                                <v-btn
                                    class="ml-2"
                                    color="primary"
                                    :disabled="props.readOnly"
                                    rounded="sm"
                                    variant="flat"
                                    @click="emit('closeFileTypeDialog', true)"
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
import { FileExtensionEntry } from "@/models/seb-server/sebSettings";

// emits
const emit = defineEmits<{
    (e: "closeFileTypeDialog", value: boolean): void;
}>();

// props
const props = defineProps<{
    fileType: FileExtensionEntry | null;
    readOnly: boolean;
}>();

const osItems = [
    {
        title: translate("sebSettings.updownloadView.filetypes.os_0"),
        value: "0",
    },
    {
        title: translate("sebSettings.updownloadView.filetypes.os_1"),
        value: "1",
    },
    {
        title: translate("sebSettings.updownloadView.filetypes.os_2"),
        value: "2",
    },
];
</script>

<style scoped>
.css-fix {
    white-space: pre-wrap; /* or pre-line */
}
</style>

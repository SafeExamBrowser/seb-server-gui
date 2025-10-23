<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Group"></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeClientGroupDialog')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    <v-form>
                        <!------------Group Name------------->
                        <v-row align="center">
                            <v-col>
                                {{ translate("monitoringDialog.info.name") }}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="groupNameField"
                                    density="compact"
                                    hide-details
                                    readonly
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <!------------Group Type------------->
                        <v-row align="center">
                            <v-col>
                                {{ translate("monitoringDialog.info.type") }}
                            </v-col>
                            <v-col>
                                <v-select
                                    v-model="clientGroupTypeSelect"
                                    density="compact"
                                    hide-details
                                    :items="clientGroupItems"
                                    readonly
                                    variant="outlined"
                                >
                                </v-select>
                            </v-col>
                        </v-row>

                        <!------------Type Description------------->
                        <v-row align="center">
                            <v-col>
                                {{
                                    translate("monitoringDialog.info.typeDesc")
                                }}
                            </v-col>
                            <v-col>
                                {{ clientGroupDescription }}
                            </v-col>
                        </v-row>

                        <!------------IP_V4_RANGE fields------------->
                        <template
                            v-if="
                                clientGroupTypeSelect ==
                                ClientGroupEnum.IP_V4_RANGE
                            "
                        >
                            <v-row>
                                <v-col>
                                    {{
                                        translate(
                                            "monitoringDialog.info.startIp",
                                        )
                                    }}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="startIpField"
                                        density="compact"
                                        hide-details
                                        readonly
                                        single-line
                                        variant="outlined"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    {{
                                        translate("monitoringDialog.info.endIp")
                                    }}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="endIpField"
                                        density="compact"
                                        hide-details
                                        readonly
                                        single-line
                                        variant="outlined"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </template>

                        <!------------CLIENT_OS fields------------->
                        <template
                            v-if="
                                clientGroupTypeSelect ==
                                ClientGroupEnum.CLIENT_OS
                            "
                        >
                            <v-row>
                                <v-col>
                                    {{
                                        translate(
                                            "monitoringDialog.info.clientOs",
                                        )
                                    }}
                                </v-col>
                                <v-col>
                                    <v-select
                                        v-model="clientOsField"
                                        density="compact"
                                        hide-details
                                        :items="clientOSItems"
                                        readonly
                                        variant="outlined"
                                    >
                                    </v-select>
                                </v-col>
                            </v-row>
                        </template>

                        <!------------NAME_ALPHABETICAL_RANGE fields------------->
                        <template
                            v-if="
                                clientGroupTypeSelect ==
                                ClientGroupEnum.NAME_ALPHABETICAL_RANGE
                            "
                        >
                            <v-row>
                                <v-col>
                                    {{
                                        translate(
                                            "monitoringDialog.info.startLetter",
                                        )
                                    }}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="startLetterField"
                                        density="compact"
                                        hide-details
                                        readonly
                                        single-line
                                        variant="outlined"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    {{
                                        translate(
                                            "monitoringDialog.info.endLetter",
                                        )
                                    }}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="endLetterField"
                                        density="compact"
                                        hide-details
                                        readonly
                                        single-line
                                        variant="outlined"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </template>
                    </v-form>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum";
import * as generalUtils from "@/utils/generalUtils";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import { ref } from "vue";
import { ClientGroup } from "@/models/seb-server/clientGroup";

// props
const props = defineProps<{
    clientGroup: ClientGroup | null;
}>();

// i18n
const i18n = useI18n();

// form fields
const groupNameField = ref<string | undefined>(props.clientGroup?.name);
const clientGroupTypeSelect = ref<ClientGroupEnum | null>(
    generalUtils.findEnumValue(ClientGroupEnum, props.clientGroup?.type),
);

const startIpField = ref<string | undefined>(props.clientGroup?.ipRangeStart);
const endIpField = ref<string | undefined>(props.clientGroup?.ipRangeEnd);

const startLetterField = ref<string | undefined>(
    props.clientGroup?.nameRangeStartLetter,
);
const endLetterField = ref<string | undefined>(
    props.clientGroup?.nameRangeEndLetter,
);

const clientOsField = ref<ClientOSEnum | null>(
    generalUtils.findEnumValue(ClientOSEnum, props.clientGroup?.clientOS),
);

const clientGroupDescription = ref<string>(
    generalUtils.getClientGroupDescription(clientGroupTypeSelect.value, i18n),
);

// emits
const emit = defineEmits<{
    (e: "closeClientGroupDialog"): void;
}>();

// client group select items
const clientGroupItems = Object.values(ClientGroupEnum)
    .filter((value) => value !== ClientGroupEnum.NONE)
    .map((value) => ({
        title: translate(value, i18n),
        value,
    }));

// client os select items
const clientOSItems = Object.values(ClientOSEnum)
    .filter((value) => value !== ClientOSEnum.NONE)
    .map((value) => ({
        title: translate(value, i18n),
        value,
    }));
</script>

<style scoped>
.on-row-hover:hover {
    background: #e4e4e4 !important;
    cursor: pointer;
}
</style>

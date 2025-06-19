<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Group"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeClientGroupDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    <v-form>
                        <!------------Group Name------------->
                        <v-row align="center">
                            <v-col>
                                {{translate("monitoringDialog.info.name")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    readonly
                                    single-line
                                    hide-details
                                    v-model="groupNameField"
                                        density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
    
                        <!------------Group Type------------->
                        <v-row align="center">
                            <v-col>
                                {{translate("monitoringDialog.info.type")}}
                            </v-col>
                            <v-col>
                                <v-select
                                    readonly
                                    hide-details
                                    v-model="clientGroupTypeSelect"
                                    density="compact"
                                    variant="outlined"
                                    :items="clientGroupItems">
                                </v-select>
                            </v-col>
                        </v-row>
    
                        <!------------Type Description------------->
                        <v-row align="center">
                            <v-col>
                                {{translate("monitoringDialog.info.typeDesc")}}
                            </v-col>
                            <v-col>
                                {{ clientGroupDescription }}
                            </v-col>
                        </v-row>
    
                        <!------------IP_V4_RANGE fields------------->
                        <template v-if="clientGroupTypeSelect == ClientGroupEnum.IP_V4_RANGE">
                            <v-row>
                                <v-col>
                                    {{translate("monitoringDialog.info.startIp")}}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        readonly
                                        single-line
                                        hide-details
                                        v-model="startIpField"
                                        density="compact"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    {{translate("monitoringDialog.info.endIp")}}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        readonly
                                        single-line
                                        hide-details
                                        v-model="endIpField"
                                        density="compact"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </template>
    
                        <!------------CLIENT_OS fields------------->
                        <template v-if="clientGroupTypeSelect == ClientGroupEnum.CLIENT_OS">
                            <v-row>
                                <v-col>
                                    {{translate("monitoringDialog.info.clientOs")}}
                                </v-col>
                                <v-col>
                                    <v-select
                                        readonly
                                        hide-details
                                        v-model="clientOsField"
                                        density="compact"
                                        variant="outlined"
                                        :items="clientOSItems">
                                    </v-select>
                                </v-col>
                            </v-row>
                        </template>
    
                        <!------------NAME_ALPHABETICAL_RANGE fields------------->
                        <template v-if="clientGroupTypeSelect == ClientGroupEnum.NAME_ALPHABETICAL_RANGE">
                            <v-row>
                                <v-col>
                                    {{translate("monitoringDialog.info.startLetter")}}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        readonly
                                        single-line
                                        hide-details
                                        v-model="startLetterField"
                                        density="compact"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    {{translate("monitoringDialog.info.endLetter")}}
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        readonly
                                        single-line
                                        hide-details
                                        v-model="endLetterField"
                                        density="compact"
                                        variant="outlined">
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
    import { useExamStore } from '@/stores/seb-server/examStore';
    import { ClientGroupEnum, ClientOSEnum } from "@/models/seb-server/clientGroupEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import * as clientGroupViewService from "@/services/seb-server/component-services/clientGroupViewService";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";

    //props
    const props = defineProps<{
        clientGroup: ClientGroup | null,
    }>();

    //i18n
    const i18n = useI18n();

    //stores
    const examStore = useExamStore();

    //error handling / validation
    const isGroupNameDuplicate = ref<boolean>(false);

    //form fields
    const groupNameField = ref<string | undefined>(props.clientGroup?.name);
    const clientGroupTypeSelect = ref<ClientGroupEnum | null>(generalUtils.findEnumValue(ClientGroupEnum, props.clientGroup?.type));

    const startIpField = ref<string | undefined>(props.clientGroup?.ipRangeStart);
    const endIpField = ref<string | undefined>(props.clientGroup?.ipRangeEnd);

    const startLetterField = ref<string | undefined>(props.clientGroup?.nameRangeStartLetter);
    const endLetterField = ref<string | undefined>(props.clientGroup?.nameRangeEndLetter);

    const clientOsField = ref<ClientOSEnum | null>(generalUtils.findEnumValue(ClientOSEnum, props.clientGroup?.clientOS));

    const clientGroupDescription = ref<string>(generalUtils.getClientGroupDescription(clientGroupTypeSelect.value, i18n));

    //emits
    const emit = defineEmits<{
        closeClientGroupDialog: any;
    }>();

    //client group select items
    const clientGroupItems = Object.values(ClientGroupEnum)
    .filter(value => value !== ClientGroupEnum.NONE)
    .map(value => ({
        title: translate(value, i18n), 
        value: value
    }));

    //client os select items
    const clientOSItems = Object.values(ClientOSEnum)
    .filter(value => value !== ClientOSEnum.NONE)
    .map(value => ({
        title: translate(value, i18n), 
        value: value
    }));

</script>

<style scoped>

    .on-row-hover:hover{
        background: #e4e4e4 !important;
        cursor: pointer;
    }

</style>
<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Edit Group"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeEditClientGroupDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!------------Create group form------------->
                <v-col>
                    <v-form>

                        <!------------Alert msg------------->
                        <v-row v-if="isGroupNameDuplicate">
                            <v-col>
                                <AlertMsg
                                    :alertProps="{
                                        title: 'Group Name already exists',
                                        color: 'warning',
                                        type: 'alert',
                                        customText: 'Please provide a different name'
                                    }">
                                </AlertMsg>
                            </v-col>
                        </v-row>

                        <!------------Exam Name------------->
                        <v-row align="center">
                            <v-col>
                                Exam
                            </v-col>
                            <v-col>
                                {{ examStore.selectedExam?.quizName }}
                            </v-col>
                        </v-row>
    
                        <!------------Group Name------------->
                        <v-row align="center">
                            <v-col>
                                Name
                            </v-col>
                            <v-col>
                                <v-text-field
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
                                Type
                            </v-col>
                            <v-col>
                                <v-select
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
                                Type Description
                            </v-col>
                            <v-col>
                                {{ clientGroupDescription }}
                            </v-col>
                        </v-row>
    
                        <!------------IP_V4_RANGE fields------------->
                        <template v-if="clientGroupTypeSelect == ClientGroupEnum.IP_V4_RANGE">
                            <v-row>
                                <v-col>
                                    Start of IP rage
                                </v-col>
                                <v-col>
                                    <v-text-field
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
                                    End of IP rage
                                </v-col>
                                <v-col>
                                    <v-text-field
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
                                    Client OS Type
                                </v-col>
                                <v-col>
                                    <v-select
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
                                    Start Letter
                                </v-col>
                                <v-col>
                                    <v-text-field
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
                                    End Letter
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        single-line
                                        hide-details
                                        v-model="endLetterField"
                                        density="compact"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </template>
    
                        <!------------Buttons------------->
                        <v-row align="center">
                            <v-col align="right">
                                <v-btn 
                                    rounded="sm" 
                                    color="black" 
                                    variant="outlined"
                                    @click="clearFields(true)">
                                    Cancel
                                </v-btn>
    
                                <v-btn 
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat" 
                                    class="ml-2"
                                    :disabled="isSaveButtonDisabled()"
                                    @click="updateClientGroup()">
                                    Save
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
    import { useExamStore } from '@/stores/seb-server/examStore';
    import { ClientGroupEnum, ClientOSEnum } from "@/models/seb-server/clientGroupEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import * as clientGroupViewService from "@/services/seb-server/component-services/clientGroupViewService";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";


    //i18n
    const i18n = useI18n();

    //stores
    const examStore = useExamStore();

    //error handling / validation
    const isGroupNameDuplicate = ref<boolean>(false);

    //form fields
    const groupNameField = ref<string>("");
    const clientGroupTypeSelect = ref<ClientGroupEnum | null>(null);

    const startIpField = ref<string>("");
    const endIpField = ref<string>("");

    const startLetterField = ref<string>("");
    const endLetterField = ref<string>("");

    const clientOsField = ref<ClientOSEnum | null>(null);

    //description text
    const clientGroupDescription = ref<string>(getInitalDescriptionValue());

    //load descriotion according to selection
    watch(clientGroupTypeSelect, () => {
        if(clientGroupTypeSelect.value == null){
            return;
        }

        clientGroupDescription.value = generalUtils.getClientGroupDescription(clientGroupTypeSelect.value, i18n);
    });

    //emits
    const emit = defineEmits<{
        closeEditClientGroupDialog: any;
    }>();

    //props
    const props = defineProps<{
        clientGroup: ClientGroup | null,
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

    onBeforeMount(() => {
        loadClientGroupIntoForm(props.clientGroup)
    });


    function loadClientGroupIntoForm(clientGroup: ClientGroup | null){
        if(clientGroup == null){
            return;
        }

        const clientGroupType: ClientGroupEnum | null = generalUtils.findEnumValue(ClientGroupEnum, clientGroup.type);

        if(clientGroupType == null){
            return;
        }

        groupNameField.value = clientGroup.name;
        clientGroupTypeSelect.value = clientGroupType

        if(clientGroupType == ClientGroupEnum.CLIENT_OS){
            clientOsField.value = generalUtils.findEnumValue(ClientOSEnum, clientGroup.clientOS);
            return;
        }

        if(clientGroupType == ClientGroupEnum.IP_V4_RANGE){
            startIpField.value = clientGroup.ipRangeStart!;
            endIpField.value = clientGroup.ipRangeEnd!;  
            return;
        }

        if(clientGroupType == ClientGroupEnum.NAME_ALPHABETICAL_RANGE){
            startLetterField.value = clientGroup.nameRangeStartLetter!;
            endLetterField.value = clientGroup.nameRangeEndLetter!;
            return;
        }
    }


    async function updateClientGroup(){
        if(examStore.selectedExam == null || clientGroupTypeSelect.value == null){
            return;
        }

        const clientGroup: ClientGroup | null = clientGroupViewService.getCreateClientGroupParams(
            examStore.selectedExam.id,
            groupNameField.value,
            clientGroupTypeSelect.value,
            startIpField.value,
            endIpField.value,
            clientOsField.value,
            startLetterField.value,
            endLetterField.value
        );

        if(clientGroup == null){
            return;
        }

        clientGroup.id = props.clientGroup?.id;
        const createClientGroupResponse: ClientGroup | null = await clientGroupViewService.updateClientGroup(clientGroup);

        if(createClientGroupResponse == null){
            return;
        }

        emit("closeEditClientGroupDialog", true);
    }

    //========form control========
    function isSaveButtonDisabled(): boolean{
        if(groupNameField.value == "" || clientGroupTypeSelect.value == null){
            return true;
        }

        if(clientGroupTypeSelect.value == ClientGroupEnum.CLIENT_OS && clientOsField.value == null){
            return true;
        }

        if(clientGroupTypeSelect.value  == ClientGroupEnum.IP_V4_RANGE && (startIpField.value == "" || endIpField.value == "")){
            return true;
        }

        if(clientGroupTypeSelect.value  == ClientGroupEnum.NAME_ALPHABETICAL_RANGE && (startLetterField.value == "" || endLetterField.value == "")){
            return true;
        }

        return false;
    }


    function clearFields(clearType: boolean){
        emit("closeEditClientGroupDialog");
    }

    function getInitalDescriptionValue(): string{
        return "No Client Group type is selected. Please select one.";
    }

</script>

<style scoped>

    .on-row-hover:hover{
        background: #e4e4e4 !important;
        cursor: pointer;
    }

</style>
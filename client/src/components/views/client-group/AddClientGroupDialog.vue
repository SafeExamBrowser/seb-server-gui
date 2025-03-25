<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Add Group"></v-toolbar-title>
            <template v-slot:append>
                <!-- <v-btn
                    variant="elevated"
                    color="#5865f2"
                    size="small">
                    Load from template
                </v-btn> -->
                <v-btn @click="emit('closeAddClientGroupDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!------------Create group form------------->
                <v-col>
                    <v-form>
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
                            <v-col>
                                <v-btn
                                    variant="elevated"
                                    color="#5865f2"
                                    size="small"
                                    :append-icon="isTableSelection ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                    @click="isTableSelection = !isTableSelection">
                                    Preload from template
                                </v-btn>
                            </v-col>
                            <v-col align="right">
                                <v-btn 
                                    rounded="sm" 
                                    color="black" 
                                    variant="outlined"
                                    @click="clearFields()">
                                    Cancel
                                </v-btn>
    
                                <v-btn 
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat" 
                                    class="ml-2"
                                    :disabled="isCreateButtonDisabled()"
                                    @click="createClientGroup()">
                                    Create
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>

            </v-row>


            <!------------load from template list------------->
            <v-row v-if="isTableSelection">
                <v-col>
                    <v-data-table 
                        hide-default-footer
                        item-value="id" 
                        class="rounded-lg elevation-4"
                        :headers="tableHeaders" 
                        :items="examStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES">

                        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                            <TableHeaders
                                :columns="columns"
                                :is-sorted="isSorted"
                                :get-sort-icon="getSortIcon"
                                :toggle-sort="toggleSort"
                                :header-refs-prop="tableHeadersRef">
                            </TableHeaders>
                        </template>

                        <template v-slot:item="{item}">
                            <tr 
                                @click="onTableRowClick(item)"
                                class="on-row-hover" >

                                <td>{{ item.name }}</td>
                                <td>{{ generalUtils.getClientGroupName(generalUtils.findEnumValue(ClientGroupEnum, item.type)) }}</td>
                            </tr>
                        </template>

                    </v-data-table>
                </v-col>
            </v-row>

        </v-card-text>
    </v-card>
</template>


<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as clientGroupViewService from "@/services/component-services/clientGroupViewService";
    import { ClientGroupEnum, ClientOSEnum } from "@/models/clientGroupEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";

    //stores
    const examStore = useExamStore();

    //table
    const isTableSelection = ref<boolean>(false);
    const tableHeadersRef = ref<any[]>();
    const tableHeaders = ref([
        {title: "Name", key: "name"},
        {title: "Type", key: "type"}
    ]);    

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

        clientGroupDescription.value = generalUtils.getClientGroupDescription(clientGroupTypeSelect.value);
    });

    //emits
    const emit = defineEmits<{
        closeAddClientGroupDialog: any;
    }>();

    //client group select items
    const clientGroupItems = Object.values(ClientGroupEnum)
    .filter(value => value !== ClientGroupEnum.NONE)
    .map(value => ({
        title: generalUtils.getClientGroupName(value), 
        value: value
    }));

    //client os select items
    const clientOSItems = Object.values(ClientOSEnum)
    .filter(value => value !== ClientOSEnum.NONE)
    .map(value => ({
        title: generalUtils.getClientOSName(value), 
        value: value
    }));


    async function createClientGroup(){
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

        console.log(clientGroup)

        if(clientGroup == null){
            return;
        }

        const createClientGroupResponse: ClientGroup | null = await clientGroupViewService.createClientGroup(clientGroup);

        if(createClientGroupResponse == null){
            return;
        }

        emit("closeAddClientGroupDialog", true);
    }



    function clearFields(){
        groupNameField.value = "";
        clientGroupTypeSelect.value = null;

        startIpField.value = "";
        endIpField.value = "";

        startLetterField.value = "";
        endLetterField.value = "";

        clientOsField.value = null;

        clientGroupDescription.value = getInitalDescriptionValue();
    }

    function getInitalDescriptionValue(): string{
        return "No Client Group type is selected. Please select one.";
    }

    function isCreateButtonDisabled(): boolean{
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

    function onTableRowClick(clientGroupTemplate: ClientGroupTemplate){
    }







    

</script>

<style scoped>

    .on-row-hover:hover{
        background: #e4e4e4 !important;
        cursor: pointer;
    }

</style>
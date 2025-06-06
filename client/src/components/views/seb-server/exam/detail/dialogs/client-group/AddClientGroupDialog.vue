<template>
    <v-card>

        <!------------title------------->
        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Add Group"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeAddClientGroupDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <!------------Create group form------------->
            <v-form>

                <!------------create from template panel------------->
                <v-row v-if="templateClientGroups.length != 0" align="center">
                    <v-col>
                        <v-expansion-panels>
                            <v-expansion-panel title="Create from template">
                                <v-expansion-panel-text>

                                    <!--@vue-ignore-->
                                    <v-data-table
                                        hide-default-footer
                                        item-value="id"
                                        class="rounded-lg elevation-4"
                                        :headers="templateClientGroupsHeaders"
                                        :items="templateClientGroups">

                                        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                                            <TableHeaders
                                                :columns="columns"
                                                :is-sorted="isSorted"
                                                :get-sort-icon="getSortIcon"
                                                :toggle-sort="toggleSort"
                                                :header-refs-prop="templateClientGroupsHeadersRef">
                                            </TableHeaders>
                                        </template>

                                        <template v-slot:item="{item}">
                                            <tr
                                                @click="onTableRowClick(item)"
                                                class="on-row-hover" >

                                                <td>{{ item.name }}</td>
                                                <td>{{ translate(generalUtils.findEnumValue(ClientGroupEnum, item.type), i18n) }}</td>
                                                <td align="center">
                                                    <v-icon :icon="examStore.templateGroupsWithSp.includes(item.id!) ? 'mdi-check' : ''"></v-icon>
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>

                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>

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

              <!------------Screen Proctoring Toggle------------->
                <v-row align="center">
                    <v-col>Screen Proctoring</v-col>
                    <v-col>
                        <v-tooltip
                          v-if="!isScreenProctoringEnabled"
                          location="right"
                        >
                            <template #activator="{ props }">
                                <span v-bind="props" class="d-inline-block">
                                    <v-btn
                                        variant="text"
                                        :icon="screenProctoringToggle ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                                        class="v-btn--disabled"
                                        @click.prevent
                                    />
                                </span>
                            </template>
                            <span>Screen Proctoring can only be selected if it is enabled on the exam itself.</span>
                        </v-tooltip>

                      <v-btn
                        v-else
                        variant="text"
                        :icon="screenProctoringToggle ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                        @click="screenProctoringToggle = !screenProctoringToggle"
                      />
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
                            :disabled="isCreateButtonDisabled"
                            @click="createClientGroup()">
                            Create
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>

        </v-card-text>
    </v-card>
</template>


<script setup lang="ts">
    import { useExamStore } from '@/stores/seb-server/examStore';
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as clientGroupViewService from "@/services/seb-server/component-services/clientGroupViewService";
    import { ClientGroupEnum, ClientOSEnum } from "@/models/seb-server/clientGroupEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";
    import * as examViewService from "@/services/seb-server/component-services/examViewService";

    //i18n
    const i18n = useI18n();

    //stores
    const examStore = useExamStore();

    //error handling / validation
    const isGroupNameDuplicate = ref<boolean>(false);

    //table
    const isTableSelection = ref<boolean>(false);
    const templateClientGroups = ref<ClientGroup[]>([]);
    const templateClientGroupsHeadersRef = ref<any[]>();
    const templateClientGroupsHeaders = ref([
        {title: "Name", key: "name"},
        {title: "Type", key: "type"},
        {title: "Screen Proctoring", key: "sp", center: true, align: "center"}
    ]);

    //form fields
    const groupNameField = ref<string>("");
    const clientGroupTypeSelect = ref<ClientGroupEnum | null>(null);
    const screenProctoringToggle = ref<boolean>(false);


    const startIpField = ref<string>("");
    const endIpField = ref<string>("");

    const startLetterField = ref<string>("");
    const endLetterField = ref<string>("");

    const clientOsField = ref<ClientOSEnum | null>(null);

    const isScreenProctoringEnabled = computed(() =>
      generalUtils.stringToBoolean(examStore.selectedExam?.additionalAttributes.enableScreenProctoring ?? '')
    );

    //description text
    const clientGroupDescription = ref<string>(getInitalDescriptionValue());

    //load description according to selection
    watch(clientGroupTypeSelect, () => {
        if(clientGroupTypeSelect.value == null){
            return;
        }

        clientGroupDescription.value = generalUtils.getClientGroupDescription(clientGroupTypeSelect.value, i18n);
    });

    //set group name duplicate warning dynamically
    watch(groupNameField, () => {
        isGroupNameDuplicate.value = false;
        if(examStore.selectedClientGroups.some(clientGroup => clientGroup.name == groupNameField.value)){
            isGroupNameDuplicate.value = true;
        }
    });

    //emits
    const emit = defineEmits<{
        closeAddClientGroupDialog: any;
    }>();

    //client group select items
    const clientGroupItems = Object.values(ClientGroupEnum)
        .filter(value => value !== ClientGroupEnum.NONE)
        .filter(value => value !== ClientGroupEnum.SP_FALLBACK_GROUP)
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
        filterClientGroupsTableValues();
    });


    //========create new client group========
    async function createClientGroup() {
      if (examStore.selectedExam == null || clientGroupTypeSelect.value == null) {
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

      if (clientGroup == null) {
        return;
      }

      const createClientGroupResponse: ClientGroup | null = await clientGroupViewService.createClientGroup(clientGroup);

      if (createClientGroupResponse == null) {
        return;
      }

      if (screenProctoringToggle.value && createClientGroupResponse.id != null) {
        const existingSpGroupIds = examStore.selectedClientGroups
          .filter(group => group.isSPSGroup)
          .map(group => group.id!)

        const updatedSpGroupIds = [...new Set([...existingSpGroupIds, createClientGroupResponse.id])]

        await examViewService.applyScreenProctoringGroups(
          examStore.selectedExam.id.toString(),
          generalUtils.createStringCommaList(updatedSpGroupIds)
        );
      }

      emit("closeAddClientGroupDialog", true);
    }


    //========table loading========
    function filterClientGroupsTableValues(){
        if(examStore.selectedExamTemplate == null){
            return;
        }
        templateClientGroups.value = examStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES;
        templateClientGroups.value = templateClientGroups.value.filter(clientGroup =>
            !examStore.selectedClientGroups.some(item => item.name == clientGroup.name)
        );
    }


    async function onTableRowClick(clientGroup: ClientGroup){
        loadClientGroupIntoForm(clientGroup);
    }

    function loadClientGroupIntoForm(clientGroup: ClientGroup){
        const clientGroupType: ClientGroupEnum | null = generalUtils.findEnumValue(ClientGroupEnum, clientGroup.type);

        if(clientGroupType == null){
            return;
        }

        groupNameField.value = clientGroup.name;
        clientGroupTypeSelect.value = clientGroupType
        screenProctoringToggle.value = examStore.templateGroupsWithSp.includes(clientGroup.id ?? -1);


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

    //========check if screen proctoring enabled for exam========
    function toggleScreenProctoring() {
      const isEnabled = generalUtils.stringToBoolean(examStore.selectedExam?.additionalAttributes.enableScreenProctoring ?? '');
      if (isEnabled) {
        screenProctoringToggle.value = !screenProctoringToggle.value;
      }
    }

    //========form control========
    const isCreateButtonDisabled = computed<boolean>(() => {
        if(isGroupNameDuplicate.value){
            return true;
        }

        if(groupNameField.value == ""){
            return true;
        }

        if(clientGroupTypeSelect.value == null){
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
    });


    function clearFields(clearType: boolean){
        emit('closeAddClientGroupDialog');
        // groupNameField.value = "";

        // if(clearType){
        //     clientGroupTypeSelect.value = null;
        // }

        // startIpField.value = "";
        // endIpField.value = "";

        // startLetterField.value = "";
        // endLetterField.value = "";

        // clientOsField.value = null;

        // clientGroupDescription.value = getInitalDescriptionValue();
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

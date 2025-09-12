<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                text="Edit Client Groups"
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeClientGroupDialog')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <!-----------selected client groups summary---------->
            <v-row>
                <v-col>
                    <!--@vue-ignore-->
                    <v-data-table
                        class="rounded-lg elevation-4"
                        :headers="tableHeaders"
                        hide-default-footer
                        item-value="id"
                        :items="clientGroups"
                    >
                        <template
                            #headers="{
                                columns,
                                isSorted,
                                getSortIcon,
                                toggleSort,
                            }"
                        >
                            <TableHeaders
                                :columns="columns"
                                :get-sort-icon="getSortIcon"
                                :header-refs-prop="tableHeadersRef"
                                :is-sorted="isSorted"
                                :toggle-sort="toggleSort"
                            >
                            </TableHeaders>
                        </template>

                        <template #item.type="{ item }">
                            {{
                                translate(
                                    generalUtils.findEnumValue(
                                        ClientGroupEnum,
                                        item.type,
                                    ),
                                    i18n,
                                )
                            }}
                        </template>

                        <!-------screen procotoring checkbox------->
                        <template #item.isSPSGroup="{ item }">
                            <v-btn
                                :disabled="
                                    !generalUtils.stringToBoolean(
                                        examStore.selectedExam!
                                            .additionalAttributes
                                            .enableScreenProctoring,
                                    )
                                "
                                :icon="
                                    item.isSPSGroup
                                        ? 'mdi-checkbox-marked'
                                        : 'mdi-checkbox-blank-outline'
                                "
                                variant="text"
                                @click="item.isSPSGroup = !item.isSPSGroup"
                            >
                            </v-btn>
                            <v-tooltip
                                v-if="
                                    !generalUtils.stringToBoolean(
                                        examStore.selectedExam!
                                            .additionalAttributes
                                            .enableScreenProctoring,
                                    )
                                "
                                activator="parent"
                            >
                                Screen Proctoring can only be selected if Screen
                                Proctoring is enabled on the exam itself
                            </v-tooltip>
                        </template>

                        <!-------edit button------->
                        <template #item.edit="{ item }">
                            <v-btn
                                icon="mdi-pencil-outline"
                                variant="text"
                                @click="openEditDialog(item)"
                            >
                            </v-btn>
                        </template>

                        <!-------delete button------->
                        <template #item.delete="{ item }">
                            <v-btn
                                icon="mdi-delete-outline"
                                variant="text"
                                @click="openDeleteDialog(item.id!)"
                            >
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>

            <!------------Buttons------------->
            <v-row>
                <v-col align="right">
                    <v-btn
                        color="black"
                        rounded="sm"
                        variant="outlined"
                        @click="emit('closeClientGroupDialog')"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        class="ml-2"
                        color="primary"
                        :disabled="!hasSpDataChanged"
                        rounded="sm"
                        variant="flat"
                        @click="saveScreenProctoringGroups()"
                    >
                        Save
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <!-----------delete dialog---------->
    <v-dialog v-model="deleteDialog" max-width="800">
        <DeleteConfirmDialog
            :entity-id="clientGroupIdToDelete"
            info-text=""
            question-text="Are you sure you want to delete the client group?"
            title="Delete Client Group"
            @close-delete-dialog="closeDeleteDialog"
            @delete-function="deleteClientGroup"
        >
        </DeleteConfirmDialog>
    </v-dialog>

    <!-----------edit dialog---------->
    <v-dialog v-model="editDialog" max-width="800">
        <EditClientGroupDialog
            :client-group="clientGroupToEdit"
            @close-edit-client-group-dialog="closeEditDialog"
        >
        </EditClientGroupDialog>
    </v-dialog>
</template>

<script setup lang="ts">
import { useExamStore } from "@/stores/seb-server/examStore";
import * as clientGroupViewService from "@/services/seb-server/component-services/clientGroupViewService";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import * as generalUtils from "@/utils/generalUtils";
import * as examViewService from "@/services/seb-server/component-services/examViewService";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";

// i18n
const i18n = useI18n();

// exam
const examId = useRoute().params.examId.toString();

// stores
const examStore = useExamStore();

// delete
const deleteDialog = ref<boolean>(false);
const clientGroupIdToDelete = ref<string | null>(null);

// edit
const editDialog = ref<boolean>(false);
const clientGroupToEdit = ref<ClientGroup | null>(null);

// items
const initialClientGroups = ref<ClientGroup[]>([]);
const clientGroups = ref<ClientGroup[]>([]);

// table
const tableHeadersRef = ref<any[]>();
const tableHeaders = ref([
    { title: "Name", key: "name", width: "50%" },
    { title: "Type", key: "type", width: "30%" },
    {
        title: "Screen Proctoring",
        key: "isSPSGroup",
        sortable: false,
        width: "10%",
        center: true,
        align: "center",
    },
    {
        title: "Edit",
        key: "edit",
        sortable: false,
        width: "5%",
        center: true,
        align: "center",
    },
    {
        title: "Delete",
        key: "delete",
        sortable: false,
        width: "5%",
        center: true,
        align: "center",
    },
]);

// emits
const emit = defineEmits<{
    closeClientGroupDialog: any;
}>();

//= ========events & watchers================
onBeforeMount(async () => {
    await getClientGroups();
});

async function getClientGroups() {
    const clientGroupResponse: ClientGroups | null =
        await clientGroupViewService.getClientGroups(examId);

    if (clientGroupResponse == null) {
        return;
    }

    clientGroups.value = clientGroupResponse.content;
    examStore.selectedClientGroups = JSON.parse(
        JSON.stringify(clientGroupResponse.content),
    );
    initialClientGroups.value = JSON.parse(
        JSON.stringify(clientGroupResponse.content),
    );
}

//= =======screen proctoring========
async function saveScreenProctoringGroups() {
    const examResponse: Exam | null =
        await examViewService.applyScreenProctoringGroups(
            examId,
            generalUtils.createStringCommaList(getGroupsWithSelectedSp()),
        );

    if (examResponse == null) {
        return;
    }

    emit("closeClientGroupDialog", true);
}

const hasSpDataChanged = computed<boolean>(() => {
    return clientGroups.value.some((item, index) => {
        return item.isSPSGroup !== initialClientGroups.value[index].isSPSGroup;
    });
});

function getGroupsWithSelectedSp(): number[] {
    return clientGroups.value
        .filter((item) => item.isSPSGroup)
        .map((item) => item.id!);
}

//= =======delete========
async function deleteClientGroup(clientGroupId?: string) {
    if (clientGroupId == null) {
        return;
    }

    const deleteClientGroupResponse: any | null =
        await clientGroupViewService.deleteClientGroup(clientGroupId);

    if (deleteClientGroupResponse == null) {
        return;
    }

    closeDeleteDialog();
    getClientGroups();
}

function openDeleteDialog(clientGroupId: number) {
    clientGroupIdToDelete.value = clientGroupId.toString();
    deleteDialog.value = true;
}

function closeDeleteDialog() {
    deleteDialog.value = false;
}

//= =======edit========
function openEditDialog(clientGroup: ClientGroup) {
    clientGroupToEdit.value = clientGroup;
    editDialog.value = true;
}

function closeEditDialog(isChange?: boolean) {
    editDialog.value = false;

    if (isChange) {
        getClientGroups();
    }
}
</script>

<style scoped>
.on-row-hover:hover {
    background: #e4e4e4 !important;
    cursor: pointer;
}

.selected-row {
    background-color: #e4e4e4 !important;
}
</style>

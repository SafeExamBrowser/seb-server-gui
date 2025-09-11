<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                text="Edit Supervisors"
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeSupervisorsDialog')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!-----------user selection table---------->
                <v-col cols="7">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                v-model="search"
                                density="compact"
                                hide-details
                                label="Search"
                                prepend-inner-icon="mdi-magnify"
                                single-line
                                variant="outlined"
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-data-table
                                :headers="tableHeaders"
                                :hover="true"
                                item-value="quiz_id"
                                :items="userAccountNames"
                                :items-length="userAccountNames.length"
                                :items-per-page="
                                    tableUtils.calcDefaultItemsPerPage(
                                        userAccountNames,
                                    )
                                "
                                :items-per-page-options="
                                    tableUtils.calcItemsPerPage(
                                        userAccountNames,
                                    )
                                "
                                :search="search"
                            >
                                <template #item="{ item }">
                                    <tr
                                        class="on-row-hover"
                                        :class="[
                                            selectedExamSupervisors.some(
                                                (userAccount) =>
                                                    userAccount.uuid ==
                                                    item.modelId,
                                            )
                                                ? 'selected-row'
                                                : '',
                                        ]"
                                        @click="onTableRowClick(item)"
                                    >
                                        <td>{{ item.name }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-col>

                <!-----------user list summary---------->
                <v-col cols="3">
                    <v-row>
                        <v-col>
                            <div class="text-h6">Selected Supervisors</div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-list select-strategy="leaf">
                                <template
                                    v-for="supervisor in selectedExamSupervisors"
                                    :key="supervisor.uuid"
                                    :value="supervisor.uuid"
                                >
                                    <v-list-item>
                                        <v-list-item-title>{{
                                            getFullUserName(supervisor)
                                        }}</v-list-item-title>

                                        <template #append="{ isSelected }">
                                            <v-list-item-action
                                                class="flex-column align-end"
                                            >
                                                <v-spacer></v-spacer>

                                                <v-btn
                                                    icon="mdi-close"
                                                    variant="flat"
                                                    @click="
                                                        removeExamSupervisor(
                                                            supervisor.uuid,
                                                        )
                                                    "
                                                >
                                                </v-btn>
                                            </v-list-item-action>
                                        </template>
                                    </v-list-item>

                                    <v-divider
                                        class="border-opacity-25"
                                        :thickness="2"
                                    ></v-divider>
                                </template>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <!-----------button row---------->
            <v-row align="center">
                <v-col align="right">
                    <v-btn
                        color="black"
                        rounded="sm"
                        variant="outlined"
                        @click="emit('closeSupervisorsDialog')"
                    >
                        {{ translate("general.cancelButton") }}
                    </v-btn>

                    <v-btn
                        class="ml-2"
                        color="primary"
                        :disabled="!hasDataChanged"
                        rounded="sm"
                        variant="flat"
                        @click="
                            emit(
                                'updateExamSupervisors',
                                selectedExamSupervisors,
                            )
                        "
                    >
                        {{ translate("general.saveButton") }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import * as tableUtils from "@/utils/table/tableUtils";
import { translate } from "@/utils/generalUtils";

// main item
const selectedExamSupervisors = ref<UserAccount[]>([]);

// items
const userAccountNames = ref<UserAccountName[]>([]);

// table
const tableHeaders = ref([{ title: "Name", key: "name" }]);

// local user search / filter
const search = ref<string>();

// props
const props = defineProps<{
    initalSupervisors: UserAccount[];
}>();

const initalSupervisorsUuids: string[] = props.initalSupervisors.map(
    (supervisor) => supervisor.uuid,
);

// emits
const emit = defineEmits<{
    closeSupervisorsDialog: any;
    updateExamSupervisors: [selectedExamSupervisors: UserAccount[]];
}>();

//= ======================events & watchers=======================
onBeforeMount(async () => {
    await getAvailableUserAccounts();
    assignSupervisorsToLocalVar();
});

function assignSupervisorsToLocalVar() {
    selectedExamSupervisors.value = JSON.parse(
        JSON.stringify(props.initalSupervisors),
    );
}

async function getAvailableUserAccounts() {
    const userAccountNamesResponse: UserAccountName[] | null =
        await userAccountViewService.getSupervisorNames();

    if (userAccountNamesResponse == null) {
        return;
    }
    userAccountNames.value = userAccountNamesResponse;
}

// checks if the data has changed, regardless the order of the elements
const hasDataChanged = computed<boolean>(() => {
    if (selectedExamSupervisors.value.length > props.initalSupervisors.length) {
        return true;
    }

    const changedDataUuids = new Set(
        selectedExamSupervisors.value.map((userAccount) => userAccount.uuid),
    );
    return !initalSupervisorsUuids.every((uuid) => changedDataUuids.has(uuid));
});

// add exam supervisor
async function onTableRowClick(selectedUserAccount: UserAccountName) {
    const index: number = selectedExamSupervisors.value.findIndex(
        (userAccount) => userAccount.uuid == selectedUserAccount.modelId,
    );

    if (index != -1) {
        selectedExamSupervisors.value.splice(index, 1);
        return;
    }

    const userAccountFull: UserAccount | null =
        await userAccountViewService.getUserAccountById(
            selectedUserAccount.modelId,
        );

    if (userAccountFull == null) {
        return;
    }

    selectedExamSupervisors.value.push(userAccountFull);
}

function removeExamSupervisor(supervisorId: string) {
    const index: number = selectedExamSupervisors.value.findIndex(
        (userAccount) => userAccount.uuid == supervisorId,
    );
    selectedExamSupervisors.value.splice(index, 1);
}

function getFullUserName(user: UserAccount): string {
    return user.username + " (" + user.name + " " + user.surname + ")";
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

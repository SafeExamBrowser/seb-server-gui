<template>
    <div class="h-100 w-100">
        <v-row dense>
            <v-col>
                <div class="text-h6 font-weight-bold mb-1">
                    {{ translate("quizImportWizard.supervisorsMain.title") }}
                </div>
                <div class="mb-3 text-body-2">
                    {{
                        translate(
                            "quizImportWizard.supervisorsMain.description",
                        )
                    }}
                </div>
            </v-col>
        </v-row>

        <v-row align="center">
            <v-col cols="6">
                <v-text-field
                    v-model="searchInput"
                    density="compact"
                    hide-details
                    :label="
                        translate('quizImportWizard.supervisorsMain.search')
                    "
                    prepend-inner-icon="mdi-magnify"
                    single-line
                    variant="outlined"
                    @keydown.enter="search = searchInput"
                    @keydown.esc="clearSearch"
                />
            </v-col>

            <v-col cols="2">
                <v-btn
                    block
                    class="rounded"
                    color="primary"
                    variant="flat"
                    @click="search = searchInput"
                >
                    {{ translate("general.searchButton") }}
                </v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn
                    block
                    class="rounded ml-0"
                    color="black"
                    variant="outlined"
                    @click="clearSearch"
                >
                    {{ translate("general.cancelButton") }}
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <!-- Available Supervisors -->
            <v-col cols="6">
                <div class="text-subtitle-1 font-weight-medium">
                    {{
                        translate(
                            "quizImportWizard.supervisorsMain.availableSupervisors",
                        )
                    }}
                </div>

                <div class="supervisor-table-wrapper">
                    <v-data-table
                        class="bordered-table no-header-table"
                        :footer-props="{ itemsPerPageOptions: [] }"
                        :headers="[]"
                        :hover="true"
                        item-value="quiz_id"
                        :items="filteredAvailableSupervisors"
                        :items-length="filteredAvailableSupervisors.length"
                        :items-per-page="10"
                    >
                        <template #item="{ item }">
                            <tr class="supervisor-row">
                                <td class="supervisor-cell">
                                    <div
                                        class="supervisor-row-content clickable"
                                        @click="onTableRowClick(item)"
                                    >
                                        <div>
                                            <div class="font-weight-medium">
                                                {{ getUsername(item.name) }}
                                            </div>
                                            <div class="text-caption">
                                                {{ getFullName(item.name) }}
                                            </div>
                                        </div>
                                        <v-icon color="primary">
                                            mdi-plus
                                        </v-icon>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
            </v-col>

            <!-- Selected Supervisors -->
            <v-col cols="6">
                <div class="text-subtitle-1 font-weight-medium">
                    {{
                        translate(
                            "quizImportWizard.supervisorsMain.selectedSupervisors",
                        )
                    }}
                </div>

                <div class="supervisor-table-wrapper">
                    <!-- Scrollable container for the list -->
                    <div class="selected-supervisors-scroll clickable">
                        <div
                            v-for="supervisor in quizImportStore.selectedExamSupervisors"
                            :key="supervisor.modelId"
                            class="supervisor-row"
                            @click="removeExamSupervisor(supervisor.modelId)"
                        >
                            <div class="supervisor-row-content">
                                <div>
                                    <div class="font-weight-medium">
                                        {{ getUsername(supervisor.name) }}
                                    </div>
                                    <div class="text-caption">
                                        {{ getFullName(supervisor.name) }}
                                    </div>
                                </div>

                                <v-icon color="error"> mdi-minus </v-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
import { translate } from "@/utils/generalUtils";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import { ref, computed, onBeforeMount } from "vue";
import { UserAccountName } from "@/models/userAccount";

// stores
const quizImportStore = useQuizImportStore();
const userAccountStore = useUserAccountStore();

// items
const userAccountNames = ref<UserAccountName[]>([]);

const searchInput = ref<string>();
const search = ref<string>();

const filteredAvailableSupervisors = computed(() => {
    return userAccountNames.value
        .filter(
            (u) =>
                !quizImportStore.selectedExamSupervisors.some(
                    (s) => s.modelId === u.modelId,
                ),
        )
        .filter((u) => {
            if (!search.value) return true;
            const searchLower = search.value.toLowerCase();
            return (
                getUsername(u.name).toLowerCase().includes(searchLower) ||
                getFullName(u.name).toLowerCase().includes(searchLower)
            );
        });
});

//= ======================events & watchers=======================
onBeforeMount(async () => {
    const userAccountNamesResponse: UserAccountName[] | null =
        await userAccountViewService.getSupervisorNames({
            institutionId: userAccountStore.userAccount?.institutionId,
        });

    if (userAccountNamesResponse == null) {
        return;
    }
    userAccountNames.value = userAccountNamesResponse;
});

// add exam supervisor
function onTableRowClick(selectedUserAccountName: UserAccountName) {
    const index: number = quizImportStore.selectedExamSupervisors.findIndex(
        (userAccount) =>
            userAccount.modelId === selectedUserAccountName.modelId,
    );

    if (index !== -1) {
        quizImportStore.selectedExamSupervisors.splice(index, 1);
        return;
    }

    quizImportStore.selectedExamSupervisors.push(selectedUserAccountName);
}

function removeExamSupervisor(supervisorId: string) {
    const index: number = quizImportStore.selectedExamSupervisors.findIndex(
        (userAccount) => userAccount.modelId === supervisorId,
    );
    quizImportStore.selectedExamSupervisors.splice(index, 1);
}

function getUsername(fullName: string): string {
    const match = fullName.match(/^(.+?) \(/);
    return match?.[1] ?? fullName;
}

function getFullName(fullName: string): string {
    const match = fullName.match(/\((.*?)\)/);
    return match?.[1] ?? "";
}
function clearSearch() {
    searchInput.value = "";
    search.value = "";
}
</script>

<style scoped>
.supervisor-row-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: white;
}

.supervisor-table-wrapper {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    height: 48vh;
    overflow: hidden;
}

.bordered-table {
    flex-grow: 1;
    overflow-y: auto;
}

.bordered-table {
    border-collapse: collapse;
}

.supervisor-row {
    border-bottom: 1px solid #e0e0e0;
}

.supervisor-cell {
    padding: 0 !important;
}

.supervisor-row-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: white;
}

.no-header-table :deep(thead) {
    display: none;
}

.clickable {
    cursor: pointer;
}

.selected-supervisors-scroll {
    overflow-y: auto;
    flex-grow: 1;
}

.supervisor-row-content .font-weight-medium {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
}

.supervisor-row-content .text-caption {
    font-size: 12px;
    line-height: 16px;
    color: #6b6b6b;
}

.supervisor-row-content:hover {
    background-color: #d8d8d8;
}
</style>

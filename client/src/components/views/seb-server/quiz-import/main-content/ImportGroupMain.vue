<template>
    <div class="h-100 w-100">
        <!-- Title + description -->
        <v-row dense>
            <v-col>
                <div class="text-h6 font-weight-bold mb-1">
                    {{ translate("quizImportWizard.groupMain.title") }}
                </div>
                <div class="mb-3 text-body-2">
                    {{ translate("quizImportWizard.groupMain.description") }}
                </div>
            </v-col>
        </v-row>

        <!-- Search + cancel -->
        <v-row align="center">
            <v-col cols="6">
                <v-text-field
                    v-model="searchInput"
                    density="compact"
                    hide-details
                    :label="translate('quizImportWizard.groupMain.search')"
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
            <!-- Available Groups -->
            <v-col cols="6">
                <div class="text-subtitle-1 font-weight-medium">
                    {{
                        translate("quizImportWizard.groupMain.availableGroups")
                    }}
                </div>

                <div class="supervisor-table-wrapper">
                    <v-data-table
                        class="bordered-table no-header-table"
                        :footer-props="{ itemsPerPageOptions: [] }"
                        :headers="[]"
                        :hover="true"
                        item-value="id"
                        :items="filteredAvailableGroups"
                        :items-length="filteredAvailableGroups.length"
                        :items-per-page="10"
                    >
                        <template #item="{ item }">
                            <tr class="supervisor-row">
                                <td class="supervisor-cell">
                                    <div
                                        class="supervisor-row-content clickable"
                                        @click="onAvailableRowClick(item)"
                                    >
                                        <div class="mr-3">
                                            <div class="font-weight-medium">
                                                {{ item.name }}
                                            </div>

                                            <!-- Meta line: icon + translated type + detail -->
                                            <div class="meta-row mt-2">
                                                <v-icon
                                                    class="mr-1"
                                                    size="16"
                                                    >{{
                                                        getTypeIcon(item)
                                                    }}</v-icon
                                                >
                                                <span class="meta-type">{{
                                                    translate(item.type)
                                                }}</span>
                                                <span
                                                    v-if="getTypeDetail(item)"
                                                    class="meta-sep"
                                                    >•</span
                                                >
                                                <span class="meta-detail">{{
                                                    getTypeDetail(item)
                                                }}</span>
                                            </div>

                                            <!-- Badges -->
                                            <div class="badge-row">
                                                <v-chip
                                                    v-if="isSp(item.id)"
                                                    class="chip-sp"
                                                    density="comfortable"
                                                    size="small"
                                                    variant="tonal"
                                                >
                                                    {{
                                                        translate(
                                                            "quizImportWizard.groupMain.spAvailable",
                                                        )
                                                    }}
                                                </v-chip>
                                            </div>
                                        </div>

                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px"
                                        >
                                            <v-icon color="primary"
                                                >mdi-plus</v-icon
                                            >
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
            </v-col>

            <!-- Selected Groups -->
            <v-col cols="6">
                <div class="text-subtitle-1 font-weight-medium">
                    {{ translate("quizImportWizard.groupMain.selectedGroups") }}
                </div>

                <div class="supervisor-table-wrapper">
                    <div class="selected-supervisors-scroll clickable">
                        <div
                            v-for="group in quizImportStore.selectedClientGroups"
                            :key="group.id"
                            class="supervisor-row"
                            @click="removeClientGroup(group.id!)"
                        >
                            <div class="supervisor-row-content">
                                <div class="mr-3">
                                    <div class="font-weight-medium">
                                        {{ group.name }}
                                    </div>

                                    <div class="meta-row mt-2">
                                        <v-icon class="mr-1" size="16">{{
                                            getTypeIcon(group)
                                        }}</v-icon>
                                        <span class="meta-type">{{
                                            translate(group.type)
                                        }}</span>
                                        <span
                                            v-if="getTypeDetail(group)"
                                            class="meta-sep"
                                            >•</span
                                        >
                                        <span class="meta-detail">{{
                                            getTypeDetail(group)
                                        }}</span>
                                    </div>

                                    <div class="badge-row">
                                        <v-chip
                                            v-if="isSp(group.id)"
                                            class="chip-sp"
                                            density="comfortable"
                                            size="small"
                                            variant="tonal"
                                        >
                                            {{
                                                translate(
                                                    "quizImportWizard.groupMain.spAvailable",
                                                )
                                            }}
                                        </v-chip>
                                    </div>
                                </div>

                                <div
                                    class="d-flex align-center"
                                    style="gap: 8px"
                                >
                                    <v-icon color="error">mdi-minus</v-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
import { translate } from "@/utils/generalUtils";
import { ref, computed } from "vue";

// stores
const quizImportStore = useQuizImportStore();

// local search state
const searchInput = ref<string>();
const search = ref<string>();

// derive available list from the template
const allGroups = computed<ClientGroup[]>(
    () => quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES ?? [],
);

// filter
const filteredAvailableGroups = computed<ClientGroup[]>(() => {
    const selectedIds = new Set(
        quizImportStore.selectedClientGroups.map((g) => g.id),
    );
    const base = allGroups.value.filter((g) => !selectedIds.has(g.id!));

    if (!search.value) return base;

    const q = (search.value || "").toLowerCase();
    return base.filter((g) => (g.name ?? "").toLowerCase().includes(q));
});

// interactions
function onAvailableRowClick(selectedGroup: ClientGroup) {
    const index = quizImportStore.selectedClientGroups.findIndex(
        (g) => g.id === selectedGroup.id,
    );
    if (index !== -1) {
        quizImportStore.selectedClientGroups.splice(index, 1);
        return;
    }
    quizImportStore.selectedClientGroups.push(selectedGroup);
}

function removeClientGroup(groupId: number) {
    const index = quizImportStore.selectedClientGroups.findIndex(
        (g) => g.id === groupId,
    );
    if (index !== -1) quizImportStore.selectedClientGroups.splice(index, 1);
}

function clearSearch() {
    searchInput.value = "";
    search.value = "";
}

const isSp = (id?: number) =>
    id != null && quizImportStore.availableSpClientGroupIds.includes(id);

// Icon by type (and OS when applicable)
function getTypeIcon(g: ClientGroup): string {
    switch (g.type) {
        case "NAME_ALPHABETICAL_RANGE":
            return "mdi-sort-alphabetical-variant";
        case "IP_V4_RANGE":
            return "mdi-lan";
        case "CLIENT_OS":
            return osToIcon(g.clientOS);
        case "SP_FALLBACK_GROUP":
        case "NONE":
        default:
            return "mdi-account-multiple-remove";
    }
}

function osToIcon(os?: string): string {
    const v = (os ?? "").toUpperCase();
    if (v.includes("WINDOWS")) return "mdi-microsoft-windows";
    if (v.includes("MAC")) return "mdi-apple";
    if (v.includes("IOS") || v.includes("IPAD")) return "mdi-cellphone";
    if (v.includes("LINUX")) return "mdi-linux";
    return "mdi-help-circle-outline";
}

// Detail text by type
function getTypeDetail(g: ClientGroup): string {
    switch (g.type) {
        case "CLIENT_OS":
            return g.clientOS ?? "";
        case "IP_V4_RANGE": {
            const a = g.ipRangeStart ?? "";
            const b = g.ipRangeEnd ?? "";
            if (a && b) return `${a} – ${b}`;
            return a || b || "";
        }
        case "NAME_ALPHABETICAL_RANGE": {
            const a = g.nameRangeStartLetter ?? "";
            const b = g.nameRangeEndLetter ?? "";
            if (a && b) return `${a} – ${b}`;
            return a || b || "";
        }
        // SP_FALLBACK_GROUP and NONE: name is enough
        case "SP_FALLBACK_GROUP":
        case "NONE":
        default:
            return "";
    }
}
</script>

<style scoped>
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
    border-collapse: collapse;
}

.no-header-table :deep(thead) {
    display: none;
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

.clickable {
    cursor: pointer;
}

.selected-supervisors-scroll {
    overflow-y: auto;
    flex-grow: 1;
}

.supervisor-row-content:hover {
    background-color: #d8d8d8;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    line-height: 16px;
    color: #6b6b6b;
    margin-top: 2px;
}

.meta-type {
    font-weight: 500;
}

.meta-sep {
    opacity: 0.6;
}

.meta-detail {
    opacity: 0.9;
}

.badge-row {
    display: flex;
    gap: 6px;
    margin-top: 6px;
}
</style>

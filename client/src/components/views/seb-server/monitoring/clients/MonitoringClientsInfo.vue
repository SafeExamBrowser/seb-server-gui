<template>
    <!-- Breadcrumb and Title -->
    <v-row dense>
        <!-- Breadcrumb -->
        <v-col class="pl-5 mb-1" cols="12" md="10">
            <div class="path-text d-flex align-center">
                <span
                    class="breadcrumb-link"
                    @click="navigateTo(constants.HOME_PAGE_ROUTE)"
                >
                    {{ translate("titles.home") }}
                </span>
                <span class="breadcrumb-arrow">›</span>
                <span
                    class="breadcrumb-link"
                    @click="navigateTo(constants.MONITORING_ROUTE)"
                >
                    {{ translate("titles.monitoring") }}
                </span>
                <span
                    v-if="monitoringStore.selectedExam !== null"
                    class="breadcrumb-arrow"
                    >›</span
                >
                <span
                    v-if="monitoringStore.selectedExam !== null"
                    class="breadcrumb-link"
                    @click="
                        navigateTo(
                            constants.MONITORING_OVERVIEW_ROUTE +
                                '/' +
                                monitoringStore.selectedExam.id.toString(),
                        )
                    "
                >
                    {{ translate("titles.overview") }}
                </span>
            </div>
        </v-col>

        <!-- Title -->
        <v-col class="pl-10" cols="12" md="10">
            <div class="primary-text-color text-h4 font-weight-bold">
                {{ monitoringStore.selectedExam?.quizName }}
            </div>
        </v-col>

        <v-col class="pl-10" cols="12" md="2"></v-col>
    </v-row>

    <v-row v-if="isInfoExpanded">
        <v-col>
            <v-sheet class="rounded-lg pl-4 pt-3 pr-4" elevation="4">
                <!------------title row------------->
                <v-row>
                    <v-col cols="4">
                        <div class="text-subtitle-1 font-weight-medium mt-2">
                            {{
                                translate(
                                    "monitoringExams.info.examNameSearchPlaceholder",
                                )
                            }}
                        </div>
                    </v-col>

                    <v-spacer></v-spacer>
                    <v-col cols="4">
                        <div class="text-subtitle-1 font-weight-medium mt-2">
                            {{ translate("monitoringClients.info.filters") }}

                            <v-chip
                                v-if="!monitoringStore.isNoFilterSelected"
                                append-icon="mdi-close"
                                class="ml-4"
                                size="small"
                                variant="tonal"
                                @click="clearFilters()"
                            >
                                {{
                                    translate("monitoringClients.info.clearAll")
                                }}
                            </v-chip>
                        </div>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col cols="3">
                        <div class="text-subtitle-1 font-weight-medium mt-2">
                            {{ translate("monitoringClients.info.actions") }}
                        </div>
                    </v-col>
                </v-row>

                <!------------search, filters and action buttons------------->
                <v-row>
                    <!------------search------------->
                    <v-col cols="4">
                        <v-form
                            @keyup.enter="loadMonitoringListItemsCaller()"
                            @keyup.esc="clearForm()"
                        >
                            <!------------field------------->
                            <v-row align="center">
                                <v-col>
                                    <v-text-field
                                        v-model="monitoringStore.searchName"
                                        append-inner-icon="mdi-magnify"
                                        density="compact"
                                        hide-details
                                        placeholder="Search Clients"
                                        single-line
                                        type="text"
                                        variant="outlined"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>

                            <!------------Buttons------------->
                            <v-row>
                                <v-col align="right">
                                    <v-btn
                                        color="black"
                                        rounded="sm"
                                        size="small"
                                        variant="outlined"
                                        @click="clearForm()"
                                    >
                                        {{ translate("general.cancelSearch") }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>

                    <!------------filters------------->
                    <v-spacer></v-spacer>
                    <v-col cols="4">
                        <v-card class="rounded-lg" variant="flat">
                            <v-row>
                                <!------------group filters------------->
                                <v-col
                                    v-if="
                                        monitoringStore.monitoringOverviewData
                                            ?.clientGroups.length != 0
                                    "
                                >
                                    <div
                                        class="text-subtitle-2 font-weight-medium"
                                    >
                                        {{
                                            translate(
                                                "monitoringClients.info.groups",
                                            )
                                        }}
                                    </div>

                                    <div
                                        v-for="clientGroup in monitoringStore
                                            .monitoringOverviewData
                                            ?.clientGroups"
                                        :key="clientGroup.id"
                                    >
                                        <v-chip
                                            class="mr-2 mt-2"
                                            size="small"
                                            :variant="
                                                isFilterSelected(
                                                    MonitoringHeaderEnum.SHOW_CLIENT_GROUPS,
                                                    clientGroup.id.toString(),
                                                )
                                                    ? 'flat'
                                                    : 'tonal'
                                            "
                                            @click="
                                                applyFilterInternal(
                                                    MonitoringHeaderEnum.SHOW_CLIENT_GROUPS,
                                                    clientGroup.id.toString(),
                                                )
                                            "
                                        >
                                            {{ clientGroup.name }}
                                        </v-chip>
                                    </div>
                                </v-col>

                                <!------------client states filters------------->
                                <v-col
                                    v-if="
                                        monitoringStore.monitoringOverviewData
                                            ?.clientStates.total != 0
                                    "
                                >
                                    <div
                                        class="text-subtitle-2 font-weight-medium"
                                    >
                                        {{
                                            translate(
                                                "monitoringClients.info.clientStates",
                                            )
                                        }}
                                    </div>

                                    <template
                                        v-for="(value, key) in monitoringStore
                                            .monitoringOverviewData
                                            ?.clientStates"
                                        :key="key"
                                    >
                                        <v-chip
                                            v-if="showStateFilter(key, value)"
                                            class="mr-2 mt-2"
                                            size="small"
                                            :variant="
                                                isFilterSelected(
                                                    MonitoringHeaderEnum.SHOW_STATES,
                                                    key,
                                                )
                                                    ? 'flat'
                                                    : 'tonal'
                                            "
                                            @click="
                                                applyFilterInternal(
                                                    MonitoringHeaderEnum.SHOW_STATES,
                                                    key,
                                                )
                                            "
                                        >
                                            {{ translate(key) }}
                                        </v-chip>
                                    </template>
                                </v-col>

                                <!------------notification filters------------->
                                <v-col>
                                    <div
                                        class="text-subtitle-2 font-weight-medium"
                                    >
                                        {{
                                            translate(
                                                "monitoringClients.info.notifications",
                                            )
                                        }}
                                    </div>

                                    <template
                                        v-for="(value, key) in monitoringStore
                                            .monitoringOverviewData
                                            ?.notifications"
                                        :key="key"
                                    >
                                        <v-chip
                                            v-if="key != 'total'"
                                            class="mr-2 mt-2"
                                            size="small"
                                            :variant="
                                                isFilterSelected(
                                                    MonitoringHeaderEnum.SHOW_NOTIFCATION,
                                                    key,
                                                )
                                                    ? 'flat'
                                                    : 'tonal'
                                            "
                                            @click="
                                                applyFilterInternal(
                                                    MonitoringHeaderEnum.SHOW_NOTIFCATION,
                                                    key,
                                                )
                                            "
                                        >
                                            {{ translate(key) }}
                                        </v-chip>
                                    </template>
                                </v-col>

                                <!------------indicators filters------------->
                                <v-col
                                    v-if="
                                        monitoringStore.monitoringOverviewData !=
                                            null &&
                                        Object.keys(
                                            monitoringStore
                                                .monitoringOverviewData
                                                ?.indicators,
                                        ).length != 0
                                    "
                                >
                                    <div
                                        class="text-subtitle-2 font-weight-medium"
                                    >
                                        {{
                                            translate(
                                                "monitoringClients.info.indicators",
                                            )
                                        }}
                                    </div>

                                    <template
                                        v-for="(value, key) in monitoringStore
                                            .monitoringOverviewData?.indicators"
                                        :key="key"
                                    >
                                        <v-chip
                                            class="mr-2 mt-2"
                                            size="small"
                                            :variant="
                                                isFilterSelected(
                                                    MonitoringHeaderEnum.SHOW_INDICATORS,
                                                    key,
                                                )
                                                    ? 'flat'
                                                    : 'tonal'
                                            "
                                            @click="
                                                applyFilterInternal(
                                                    MonitoringHeaderEnum.SHOW_INDICATORS,
                                                    key,
                                                )
                                            "
                                        >
                                            {{ translate(key) }}
                                        </v-chip>
                                    </template>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-spacer></v-spacer>

                    <!------------action buttons------------->
                    <v-col cols="3">
                        <div class="d-flex flex-column pr-11">
                            <v-btn
                                class="mt-2"
                                color="black"
                                :disabled="isScreenLockDisabled()"
                                prepend-icon="mdi-monitor-lock"
                                rounded="sm"
                                variant="outlined"
                                @click="
                                    openInstructionConfirmDialog(
                                        InstructionEnum.SEB_FORCE_LOCK_SCREEN,
                                        false,
                                    )
                                "
                            >
                                {{
                                    translate(
                                        "monitoringClients.info.lockClients",
                                    )
                                }}
                            </v-btn>
                        </div>

                        <div class="d-flex flex-column pr-11">
                            <v-btn
                                class="mt-2 text-wrap"
                                color="black"
                                :disabled="isSEBQuitDisabled()"
                                prepend-icon="mdi-backspace-outline"
                                rounded="sm"
                                variant="outlined"
                                @click="
                                    openInstructionConfirmDialog(
                                        InstructionEnum.SEB_QUIT,
                                        false,
                                    )
                                "
                            >
                                {{
                                    translate(
                                        "monitoringClients.info.quitClients",
                                    )
                                }}
                            </v-btn>
                        </div>

                        <div class="d-flex flex-column pr-11">
                            <v-btn
                                class="mt-2"
                                color="black"
                                :disabled="isCancelConnectionDisabled()"
                                prepend-icon="mdi-cancel"
                                rounded="sm"
                                variant="outlined"
                                @click="
                                    openInstructionConfirmDialog(
                                        InstructionEnum.SEB_MARK_AS_CANCELLED,
                                        true,
                                    )
                                "
                            >
                                {{
                                    translate(
                                        "monitoringClients.info.cancelClients",
                                    )
                                }}
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

                <!------------navigation row------------->
                <v-row>
                    <!------------back button------------->
                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-start mt-auto">
                            <v-icon
                                icon="mdi-arrow-left"
                                variant="flat"
                                @click="
                                    navigateTo(
                                        constants.MONITORING_OVERVIEW_ROUTE +
                                            '/' +
                                            examId,
                                    )
                                "
                            >
                            </v-icon>
                        </div>
                    </v-col>

                    <!------------collapse button------------->
                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-end mt-auto">
                            <v-icon
                                icon="mdi-chevron-up"
                                variant="flat"
                                @click="isInfoExpanded = !isInfoExpanded"
                            >
                            </v-icon>
                        </div>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

    <!------------collapsed info panel------------->
    <v-row v-else>
        <v-col>
            <v-sheet class="rounded-lg pl-4 pt-3 pr-4" elevation="4">
                <v-row>
                    <v-col>
                        <div
                            class="primary-text-color text-h5 font-weight-bold"
                        >
                            {{ monitoringStore.selectedExam?.quizName }}
                        </div>
                    </v-col>
                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-end mt-auto">
                            <v-icon
                                icon="mdi-chevron-down"
                                variant="flat"
                                @click="isInfoExpanded = !isInfoExpanded"
                            >
                            </v-icon>
                        </div>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

    <!-----------instruction confirm dialog---------->
    <v-dialog v-model="instructionConfirmDialog" max-width="600">
        <InstructionConfirmDialog
            :connection-tokens="selectedConnectionTokens"
            :instruction-type="selectedInstructionType"
            :is-cancel-instruction="isSelectedInstructionCancel"
            @close-instruction-confirm-dialog="closeInstructionConfirmDialog"
        >
        </InstructionConfirmDialog>
    </v-dialog>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import { storeToRefs } from "pinia";
import * as generalUtils from "@/utils/generalUtils";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import { LocationQuery, useRoute } from "vue-router";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";
import { InstructionEnum } from "@/models/seb-server/instructionEnum";
import { useErrorStore } from "@/stores/seb-server/errorStore";
import { ref } from "vue";
import { ErrorProps } from "@/models/alertProps";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum";
import InstructionConfirmDialog from "@/components/views/seb-server/monitoring/dialogs/InstructionConfirmDialog.vue";

// info panel (whole component)
const isInfoExpanded = ref<boolean>(true);

// router
const route = useRoute();

// stores
const monitoringStore = useMonitoringStore();
storeToRefs(monitoringStore);
const errorStore = useErrorStore();

// exam
const examId = useRoute().params.examId.toString();

// instruction confirm dialog
const instructionConfirmDialog = ref<boolean>(false);
const selectedInstructionType = ref<InstructionEnum | null>(null);
const isSelectedInstructionCancel = ref<boolean>(false);
const selectedConnectionTokens = ref<string>("");

const emit = defineEmits<{
    (e: "updatePageInfo"): void;
}>();

function isScreenLockDisabled(): boolean {
    return (
        monitoringStore.selectedMonitoringIds.length == 0 ||
        getConnectionTokens(InstructionEnum.SEB_FORCE_LOCK_SCREEN) == null
    );
}

function isSEBQuitDisabled(): boolean {
    return (
        monitoringStore.selectedMonitoringIds.length == 0 ||
        getConnectionTokens(InstructionEnum.SEB_QUIT) == null
    );
}

function isCancelConnectionDisabled(): boolean {
    return (
        monitoringStore.selectedMonitoringIds.length == 0 ||
        getConnectionTokens(InstructionEnum.SEB_MARK_AS_CANCELLED) == null
    );
}

function showStateFilter(key: string, value: number | undefined): boolean {
    return (
        key != "total" &&
        (value != 0 || isFilterSelected(MonitoringHeaderEnum.SHOW_STATES, key))
    );
}

function loadMonitoringListItemsCaller() {
    emit("updatePageInfo");
}

function clearFilters() {
    monitoringViewService.applyShowAllFilter();
    emit("updatePageInfo");
}

function clearForm() {
    monitoringStore.searchName = null;
    loadMonitoringListItemsCaller();
}

//= ================filters===================
function getCurrentRouteQueries(): LocationQuery {
    return route.query;
}

function isFilterSelected(
    filterType: MonitoringHeaderEnum,
    filterValue: string,
): boolean {
    if (route.query[filterType]?.includes(filterValue)) {
        return true;
    }

    return false;
}

function applyFilterInternal(
    filterType: MonitoringHeaderEnum,
    filterValue: string,
) {
    monitoringViewService.applyFilter(
        getCurrentRouteQueries(),
        filterType,
        filterValue,
    );
    emit("updatePageInfo");
}

//= ==============instruction confirm dialog====================
function openInstructionConfirmDialog(
    instructionType: InstructionEnum | null,
    isCancelInstruction: boolean,
) {
    if (instructionType == null) {
        return;
    }

    const connectionTokens: string | null =
        getConnectionTokens(instructionType);
    if (connectionTokens == null) {
        const errorProps: ErrorProps = {
            color: "error",
            textKey: "no-data",
            timeout: 5000,
        };

        errorStore.showError(errorProps);
        return;
    }

    selectedInstructionType.value = instructionType;
    selectedConnectionTokens.value = connectionTokens;
    isSelectedInstructionCancel.value = isCancelInstruction;

    instructionConfirmDialog.value = true;
}

function closeInstructionConfirmDialog() {
    instructionConfirmDialog.value = false;
}

function getConnectionTokens(instructionType: InstructionEnum): string | null {
    if (monitoringStore.monitoringData == null) {
        return null;
    }

    // get token and add it to list
    const connectionTokens: string[] = [];
    monitoringStore.selectedMonitoringIds.forEach((id) => {
        const row = monitoringStore.monitoringData.get(id);
        if (row) {
            switch (instructionType) {
                case (InstructionEnum.SEB_QUIT,
                InstructionEnum.SEB_FORCE_LOCK_SCREEN): {
                    if (
                        !row.missing &&
                        (row.status == ConnectionStatusEnum.ACTIVE ||
                            row.status ==
                                ConnectionStatusEnum.CONNECTION_REQUESTED ||
                            row.status == ConnectionStatusEnum.READY)
                    ) {
                        connectionTokens.push(row.connectionToken);
                    }
                    break;
                }
                case InstructionEnum.SEB_MARK_AS_CANCELLED: {
                    if (
                        row.status == ConnectionStatusEnum.CLOSED ||
                        row.status == ConnectionStatusEnum.MISSING ||
                        row.missing
                    ) {
                        connectionTokens.push(row.connectionToken);
                    }
                    break;
                }
                default:
            }
        }
    });

    if (connectionTokens.length === 0) {
        return null;
    }

    // create string and return string comma list
    return generalUtils.createStringCommaList(connectionTokens);
}
</script>

<style scoped></style>

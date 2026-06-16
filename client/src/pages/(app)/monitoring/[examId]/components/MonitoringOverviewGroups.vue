<template>
    <v-card border elevation="1" rounded="lg">
        <div class="d-flex align-center ga-2 px-5 py-4">
            <span class="text-body-medium font-weight-bold">
                {{ $t("monitoringOverview.groups.groups") }}
            </span>
            <v-spacer />
            <span
                v-if="groupCount > 0"
                class="text-body-small font-weight-medium text-medium-emphasis"
            >
                {{ groupCount }} {{ $t("monitoringOverview.groups.groups") }}
            </span>
        </div>
        <v-divider />

        <div class="pa-5">
            <v-row>
                <v-col
                    v-for="clientGroupItem in overViewClientGroups"
                    :key="clientGroupItem.id"
                    cols="12"
                    sm="6"
                    lg="3"
                >
                    <v-sheet
                        border
                        rounded="lg"
                        class="pa-5 d-flex flex-column ga-4 h-100"
                    >
                        <div
                            class="d-flex align-start justify-space-between ga-2"
                        >
                            <div>
                                <div
                                    class="text-body-large pb-1 font-weight-bold"
                                >
                                    {{ getGroupName(clientGroupItem) }}
                                </div>
                                <div
                                    class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                                >
                                    {{ translate(clientGroupItem.type) }}
                                </div>
                            </div>
                            <v-chip
                                color="primary"
                                variant="tonal"
                                size="small"
                                class="font-weight-semibold flex-shrink-0"
                            >
                                {{ clientGroupItem.clientAmount
                                }}{{ $t("monitoringOverview.groups.clients") }}
                            </v-chip>
                        </div>

                        <div
                            class="d-flex align-center ga-2 text-body-medium font-weight-medium text-medium-emphasis"
                        >
                            <v-icon size="18">
                                {{ getGroupIcon(clientGroupItem) }}
                            </v-icon>
                            <span class="font-weight-semibold">{{
                                getGroupValueText(clientGroupItem)
                            }}</span>
                        </div>

                        <div class="d-flex flex-wrap ga-2 mt-auto">
                            <v-btn
                                v-if="clientGroupItem.spsGroupUUID"
                                color="primary"
                                class="text-body-small"
                                variant="flat"
                                size="small"
                                prepend-icon="mdi-monitor-eye"
                                @click="
                                    openGalleryView(
                                        clientGroupItem.spsGroupUUID,
                                    )
                                "
                            >
                                {{
                                    $t(
                                        "monitoringOverview.groups.buttons.proctor",
                                    )
                                }}
                            </v-btn>
                            <v-btn
                                color="primary"
                                variant="outlined"
                                class="text-body-small"
                                size="small"
                                prepend-icon="mdi-format-list-bulleted"
                                @click="
                                    goToMonitoring(
                                        MonitoringHeaderEnum.SHOW_CLIENT_GROUPS,
                                        generalUtils.createStringCommaList([
                                            clientGroupItem.id,
                                        ]),
                                        examId,
                                    )
                                "
                            >
                                {{
                                    $t(
                                        "monitoringOverview.groups.buttons.viewList",
                                    )
                                }}
                            </v-btn>
                        </div>
                    </v-sheet>
                </v-col>

                <v-col
                    v-if="!isSPGroupAvailable && isScreenProctoringAvailable"
                    cols="12"
                    sm="6"
                    lg="3"
                >
                    <v-sheet
                        border
                        rounded="lg"
                        class="pa-5 d-flex flex-column ga-4 h-100"
                    >
                        <div
                            class="d-flex align-start justify-space-between ga-2"
                        >
                            <div>
                                <div class="text-body-medium font-weight-bold">
                                    {{
                                        $t("monitoringOverview.groups.spsGroup")
                                    }}
                                </div>
                            </div>
                            <v-chip
                                color="primary"
                                variant="tonal"
                                size="small"
                                class="flex-shrink-0"
                            >
                                {{
                                    screenProctoringFallbackGroup?.clientAmount ??
                                    0
                                }}{{ $t("monitoringOverview.groups.clients") }}
                            </v-chip>
                        </div>

                        <div
                            class="d-flex align-center ga-2 text-body-medium font-weight-medium text-medium-emphasis"
                        >
                            <v-icon size="18">mdi-account-multiple</v-icon>
                            <span>
                                {{
                                    $t("monitoringOverview.groups.spsFallback")
                                }}
                            </span>
                        </div>

                        <div class="d-flex flex-wrap ga-2 mt-auto">
                            <v-btn
                                v-if="screenProctoringFallbackGroup !== null"
                                color="primary"
                                class="text-body-small"
                                variant="flat"
                                size="small"
                                prepend-icon="mdi-monitor-eye"
                                @click="
                                    openGalleryView(
                                        screenProctoringFallbackGroup.spsGroupUUID ??
                                            '',
                                    )
                                "
                            >
                                {{
                                    $t(
                                        "monitoringOverview.groups.buttons.proctor",
                                    )
                                }}
                            </v-btn>
                            <v-btn
                                color="primary"
                                variant="outlined"
                                size="small"
                                prepend-icon="mdi-format-list-bulleted"
                                class="text-body-small"
                                @click="
                                    goToMonitoring(
                                        MonitoringHeaderEnum.SHOW_STATES,
                                        getScreenProctoringState(),
                                        examId,
                                    )
                                "
                            >
                                {{
                                    $t(
                                        "monitoringOverview.groups.buttons.viewList",
                                    )
                                }}
                            </v-btn>
                        </div>
                    </v-sheet>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum.ts";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import { OverviewClientGroup } from "@/models/seb-server/monitoring.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { goToMonitoring } from "../composables/useMonitoringNavigation.ts";
import { useRouter } from "vue-router";

const props = defineProps<{
    examId: string;
}>();

const monitoringStore = useMonitoringStore();
const router = useRouter();
const examId = props.examId;

const overViewClientGroups: ComputedRef<OverviewClientGroup[] | null> =
    computed(() => {
        if (monitoringStore.monitoringOverviewData?.clientGroups == null) {
            return null;
        }

        const normalGroups =
            monitoringStore.monitoringOverviewData?.clientGroups.filter(
                (item) => item.type !== ClientGroupEnum.SP_FALLBACK_GROUP,
            );

        if (isSPGroupAvailable.value) {
            const fallBackGroup =
                monitoringStore.monitoringOverviewData?.clientGroups.filter(
                    (item) => item.type === ClientGroupEnum.SP_FALLBACK_GROUP,
                );
            return [...normalGroups, ...fallBackGroup];
        }

        return normalGroups;
    });

const groupCount = computed(() => overViewClientGroups.value?.length ?? 0);

const isSPGroupAvailable: ComputedRef<boolean> = computed(() => {
    const normalGroups =
        monitoringStore.monitoringOverviewData?.clientGroups.filter(
            (item) => item.type !== ClientGroupEnum.SP_FALLBACK_GROUP,
        );

    if (normalGroups == null) {
        return false;
    }

    for (let i = 0; i < normalGroups.length; i++) {
        if (
            normalGroups[i].spsGroupUUID != null &&
            normalGroups[i].spsGroupUUID !== ""
        ) {
            return true;
        }
    }

    return false;
});

const isScreenProctoringAvailable: ComputedRef<boolean> = computed(() => {
    return (
        monitoringStore.selectedExam?.additionalAttributes
            .enableScreenProctoring === "true"
    );
});

const screenProctoringFallbackGroup: ComputedRef<OverviewClientGroup | null> =
    computed(() => {
        if (monitoringStore.monitoringOverviewData == null) {
            return null;
        }
        for (
            let i = 0;
            i < monitoringStore.monitoringOverviewData.clientGroups.length;
            i++
        ) {
            if (
                monitoringStore.monitoringOverviewData.clientGroups[i].type ===
                ClientGroupEnum.SP_FALLBACK_GROUP
            ) {
                return monitoringStore.monitoringOverviewData.clientGroups[i];
            }
        }
        return null;
    });

function getGroupName(group: OverviewClientGroup): string {
    if (
        group.type === ClientGroupEnum.SP_FALLBACK_GROUP &&
        isSPGroupAvailable.value
    ) {
        return translate("monitoringOverview.groups.fallbackGroup");
    }

    return `${group.name}`;
}

function getGroupIcon(group: OverviewClientGroup): string {
    switch (group.type) {
        case ClientGroupEnum.NAME_ALPHABETICAL_RANGE:
            return "mdi-sort-alphabetical-variant";
        case ClientGroupEnum.IP_V4_RANGE:
            return "mdi-lan";
        case ClientGroupEnum.CLIENT_OS:
            return getClientOsIcon(group.typeValue);
        case ClientGroupEnum.NONE:
        case ClientGroupEnum.SP_FALLBACK_GROUP:
            return "mdi-account-multiple-remove";
        default:
            return "mdi-help-circle-outline";
    }
}

function getClientOsIcon(typeValue: string): string {
    if (typeValue === ClientOSEnum.WINDOWS) {
        return "mdi-microsoft-windows";
    }
    if (typeValue === ClientOSEnum.MAC_OS) {
        return "mdi-apple";
    }
    if (["I_OS", "IPAD_OS", "I_OS_OR_IPAD_OS"].includes(typeValue)) {
        return "mdi-cellphone";
    }
    return "mdi-help-circle-outline";
}

function getGroupValueText(group: OverviewClientGroup): string {
    if (group.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE) {
        return `${translate("monitoringOverview.groups.range")} ${group.typeValue}`;
    }
    if (
        group.type === ClientGroupEnum.NONE ||
        group.type === ClientGroupEnum.SP_FALLBACK_GROUP
    ) {
        return translate("monitoringOverview.groups.spsFallback");
    }
    return translate(group.typeValue);
}

function getScreenProctoringState(): string {
    if (monitoringStore.selectedExam == null) {
        return ConnectionStatusEnum.ACTIVE;
    }

    if (!monitoringStore.selectedExam.lmsSetupId) {
        return ConnectionStatusEnum.READY + "," + ConnectionStatusEnum.ACTIVE;
    }

    return ConnectionStatusEnum.ACTIVE;
}

function openGalleryView(groupUuid: string) {
    void router.push({
        name: "/(app)/gallery_[uuid]_[examId]/",
        params: { uuid: groupUuid, examId },
    });
}
</script>

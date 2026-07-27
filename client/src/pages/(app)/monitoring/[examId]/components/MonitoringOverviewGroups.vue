<template>
    <v-card border elevation="1" rounded="lg" class="h-100">
        <div class="d-flex align-center ga-2 px-5 py-4 bg-background">
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
                        class="d-flex flex-column h-100 overflow-hidden"
                    >
                        <div
                            class="d-flex align-start justify-space-between ga-2 px-5 pt-5 pb-3 bg-background"
                        >
                            <div class="text-body-large font-weight-bold">
                                {{ getGroupName(clientGroupItem) }}
                            </div>
                            <v-chip
                                color="surface"
                                variant="flat"
                                size="small"
                                class="border font-weight-semibold flex-shrink-0"
                            >
                                {{ clientGroupItem.activeClients
                                }}{{ $t("monitoringOverview.groups.clients") }}
                            </v-chip>
                        </div>

                        <div class="text-body-small px-5 pt-4 py-2">
                            {{ translate(clientGroupItem.type) }}:
                            <span class="font-weight-bold">{{
                                getGroupValue(clientGroupItem)
                            }}</span>
                        </div>

                        <div
                            class="d-flex flex-wrap ga-2 px-5 pt-2 pb-5 mt-auto"
                        >
                            <div>
                                <v-btn
                                    v-if="clientGroupItem.spsGroupUUID"
                                    color="primary"
                                    class="text-body-small"
                                    variant="flat"
                                    size="small"
                                    prepend-icon="mdi-monitor-eye"
                                    :disabled="!hasUserGalleryAccess()"
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
                                <v-tooltip
                                    v-if="!hasUserGalleryAccess()"
                                    activator="parent"
                                    location="top left"
                                    max-width="400"
                                >
                                    {{
                                        translate(
                                            "monitoringOverview.groups.noSPSAccess",
                                        )
                                    }}
                                </v-tooltip>
                            </div>
                            <v-btn
                                color="primary"
                                variant="outlined"
                                class="text-body-small"
                                size="small"
                                prepend-icon="mdi-format-list-bulleted"
                                @click="
                                    goToMonitoringOfGroup(
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
                        class="d-flex flex-column h-100 overflow-hidden"
                    >
                        <div
                            class="d-flex align-start justify-space-between ga-2 px-5 pt-5 pb-4 bg-background"
                        >
                            <div class="text-body-large font-weight-bold">
                                {{ $t("monitoringOverview.groups.spsGroup") }}
                            </div>
                            <v-chip
                                color="surface"
                                variant="flat"
                                size="small"
                                class="border font-weight-semibold flex-shrink-0"
                            >
                                {{
                                    screenProctoringFallbackGroup?.clientAmount ??
                                    0
                                }}{{ $t("monitoringOverview.groups.clients") }}
                            </v-chip>
                        </div>

                        <div class="text-body-small px-5 py-2">
                            {{ $t("monitoringOverview.groups.spsFallback") }}
                        </div>

                        <div
                            class="d-flex flex-wrap ga-2 px-5 pt-4 pb-5 mt-auto"
                        >
                            <div>
                                <v-btn
                                    v-if="
                                        screenProctoringFallbackGroup !== null
                                    "
                                    color="primary"
                                    class="text-body-small"
                                    variant="flat"
                                    size="small"
                                    prepend-icon="mdi-monitor-eye"
                                    :disabled="!hasUserGalleryAccess()"
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
                                <v-tooltip
                                    v-if="!hasUserGalleryAccess()"
                                    activator="parent"
                                    location="top left"
                                    max-width="400"
                                >
                                    {{
                                        translate(
                                            "monitoringOverview.groups.noSPSAccess",
                                        )
                                    }}
                                </v-tooltip>
                            </div>

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
import type { ComputedRef } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { OverviewClientGroup } from "@/models/seb-server/monitoring.ts";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import {
    goToMonitoring,
    goToMonitoringOfGroup,
} from "@/pages/(app)/monitoring/[examId]/composables/useMonitoringNavigation.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { translate } from "@/utils/generalUtils.ts";

const props = defineProps<{
    examId: string;
}>();

const monitoringStore = useMonitoringStore();
const router = useRouter();
const examId = props.examId;
const { data: currentUser } = useCurrentUserQuery();

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

const hasUserGalleryAccess = (): boolean => {
    if (!monitoringStore.selectedExam) {
        return false;
    }
    if (!currentUser.value) {
        return false;
    }
    return (
        monitoringStore.selectedExam.supporter.indexOf(currentUser.value.uuid) >
        0
    );
};

function getGroupName(group: OverviewClientGroup): string {
    if (
        group.type === ClientGroupEnum.SP_FALLBACK_GROUP &&
        isSPGroupAvailable.value
    ) {
        return translate("monitoringOverview.groups.fallbackGroup");
    }

    return `${group.name}`;
}

function getGroupValue(group: OverviewClientGroup): string {
    if (
        group.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE ||
        group.type === ClientGroupEnum.IP_V4_RANGE
    ) {
        return group.typeValue;
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

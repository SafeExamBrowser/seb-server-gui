<template>
    <BasicPage
        :title="$t('titles.scheduledDeletionReport')"
        :bread-crumb="[
            {
                label: $t('titles.scheduled-deletion'),
                link: { name: '/(app)/scheduled-deletion/' },
            },
            { label: $t('titles.scheduledDeletionReport') },
        ]"
        data-test-id="scheduledDeleteReportTest"
    >
        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="report.loading"
                :errors="report.errors"
            >
                <v-row>
                    <DetailBox
                        :title="`Scheduled Deletion ${formatTimestampToFullDate(report.scheduledDelete?.scheduleTime ?? 0)}`"
                    >
                        <KeyValueList
                            :items="report.reportItems!"
                            class="pt-4"
                        />
                    </DetailBox>
                </v-row>

                <v-row
                    v-if="
                        report.deletionErrors &&
                        report.deletionErrors.length > 0
                    "
                >
                    <DetailBox :title="$t('scheduledDelete.report.failed')">
                        <template #action>
                            <v-chip size="small" variant="tonal" color="red">
                                {{ report.deletionErrors.length }}
                            </v-chip>
                        </template>

                        <div
                            v-for="(info, index) in report.deletionErrors"
                            :key="index"
                            class="pa-3"
                        >
                            <v-row v-if="info.examName" class="ma-0">
                                <b>
                                    {{
                                        ` ${info.examName} - ${formatTimestampToFullDate(info.examStartTime)}`
                                    }}</b
                                >
                            </v-row>
                            <v-row v-if="info.errorType" class="ma-0">
                                {{
                                    $t(
                                        "scheduledDelete.report.errorType." +
                                            info.errorType,
                                    )
                                }}
                                <v-tooltip
                                    activator="parent"
                                    location="top left"
                                    :text="info.error"
                                />
                            </v-row>
                            <v-row class="mt-2 mb-2">
                                <v-col v-if="info.numberOfSessions">
                                    {{
                                        `SEB Server Sessions: ${info.numberOfSessions}`
                                    }}
                                </v-col>
                                <v-col v-if="info.spsGroups">
                                    <v-row class="mt-0 mb-0">{{
                                        $t(
                                            "scheduledDelete.report.spsGroupsTitle",
                                        )
                                    }}</v-row>
                                    <v-row
                                        v-for="(group, index) in info.spsGroups"
                                        :key="index"
                                        class="mt-0 mb-0"
                                        >{{ getGroupInfo(group) }}</v-row
                                    >
                                </v-col>
                            </v-row>
                            <v-divider thickness="3" class="mt-2" />
                        </div>
                    </DetailBox>
                </v-row>

                <v-row
                    v-if="
                        report.examDeletions && report.examDeletions.length > 0
                    "
                >
                    <v-col>
                        <DetailBox
                            :title="
                                report.scheduledDelete?.state ===
                                ScheduledDeleteStatusEnum.PENDING
                                    ? $t(
                                          'scheduledDelete.report.examsInfoTitle',
                                      )
                                    : $t('scheduledDelete.report.examsDeleted')
                            "
                        >
                            <template #action>
                                <v-chip
                                    size="small"
                                    variant="tonal"
                                    color="blue"
                                >
                                    {{ report.examDeletions.length }}
                                </v-chip>
                            </template>

                            <div
                                v-for="(info, index) in report.examDeletions"
                                :key="index"
                                class="pa-3"
                            >
                                <v-row v-if="info.examName" class="ma-0">
                                    <b>
                                        {{
                                            ` ${info.examName} - ${formatTimestampToFullDate(info.examStartTime)}`
                                        }}</b
                                    >
                                </v-row>
                                <v-row class="mt-2 mb-2">
                                    <v-col v-if="info.numberOfSessions">
                                        {{
                                            `SEB Server Sessions: ${info.numberOfSessions}`
                                        }}
                                    </v-col>
                                    <v-col v-if="info.spsGroups">
                                        <v-row class="mt-0 mb-0">{{
                                            $t(
                                                "scheduledDelete.report.spsGroupsTitle",
                                            )
                                        }}</v-row>
                                        <v-row
                                            v-for="(
                                                group, index
                                            ) in info.spsGroups"
                                            :key="index"
                                            class="mt-0 mb-0"
                                            >{{ getGroupInfo(group) }}</v-row
                                        >
                                    </v-col>
                                </v-row>
                                <v-divider thickness="3" class="mt-2" />
                            </div>
                        </DetailBox>
                    </v-col>
                </v-row>
                <v-row
                    v-if="report.spsDeletions && report.spsDeletions.length > 0"
                >
                    <DetailBox
                        :title="
                            report.scheduledDelete?.state ===
                            ScheduledDeleteStatusEnum.PENDING
                                ? $t('scheduledDelete.report.spsInfoTitle')
                                : $t('scheduledDelete.report.deletedSPSInfo')
                        "
                    >
                        <template #action>
                            <v-chip size="small" variant="tonal" color="blue">
                                {{ report.spsDeletions.length }}
                            </v-chip>
                        </template>

                        <div
                            v-for="(info, index) in report.spsDeletions"
                            :key="index"
                            class="pa-3"
                        >
                            <v-row v-if="info.spsExamName" class="ma-0">
                                <b>
                                    {{
                                        ` ${info.spsExamName} - ${formatTimestampToFullDate(info.examStartTime)}`
                                    }}</b
                                >
                            </v-row>
                            <v-row class="mt-2 mb-2">
                                <v-col v-if="info.numberOfSessions">
                                    {{
                                        `SEB Server Sessions: ${info.numberOfSessions}`
                                    }}
                                </v-col>
                                <v-col v-if="info.spsGroups">
                                    <v-row class="mt-0 mb-0">{{
                                        $t(
                                            "scheduledDelete.report.spsGroupsTitle",
                                        )
                                    }}</v-row>
                                    <v-row
                                        v-for="(group, index) in info.spsGroups"
                                        :key="index"
                                        class="mt-0 mb-0"
                                        >{{ getGroupInfo(group) }}</v-row
                                    >
                                </v-col>
                            </v-row>
                            <v-divider thickness="3" class="mt-2" />
                        </div>
                    </DetailBox>
                </v-row>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useScheduledDeletionReport } from "@/pages/(app)/scheduled-deletion/composables/useScheduledDeletionReport";
import { useRoute } from "vue-router";
import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { formatTimestampToFullDate } from "@/utils/timeUtils";
import {
    ScheduledDeleteStatusEnum,
    SPSGroupInfo,
} from "@/models/seb-server/scheduled-deletion";
import { useI18n } from "vue-i18n";

definePage({
    meta: {
        titleKey: "titles.scheduledDeletionReport",
        pageTestId: "scheduledDeleteReport-page",
    },
});

const { t } = useI18n();
const route = useRoute();
const id = route.params.id;

const { report } = useScheduledDeletionReport(id);

function getGroupInfo(group: SPSGroupInfo): string {
    return `${t("scheduledDelete.report.spsGroupsName")}: ${group.groupName} - ${t("scheduledDelete.report.spsGroupSessions")}: ${group.numberOfSessions}`;
}
</script>

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    ExamStatusEnum,
    ExamTypeEnum,
} from "@/models/seb-server/examFiltersEnum";
import { MonitoringRow } from "@/models/seb-server/monitoringClients";
import { ServerTablePaging } from "@/models/types";
import {
    ClientEvent,
    ClientNotification,
    MonitoringOverview,
    MonitoringStaticClientData,
    SingleConnection,
} from "@/models/seb-server/monitoring";
import { Indicators } from "@/models/seb-server/indicators";
import { Exam } from "@/models/seb-server/exam";
import { ClientGroup, ClientGroups } from "@/models/seb-server/clientGroup";
import { SebClientConnection } from "@/models/seb-server/clientConnectionList";
import { AppSignatureKeysWithGrantValues } from "@/models/seb-server/appSignatureKey";
import { LocationQueryRaw } from "vue-router";

export const useMonitoringStore = defineStore("monitoring", () => {
    // exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const activeTypeFilter = ref<ExamTypeEnum | null>(null);
    const activeStatusFilter = ref<ExamStatusEnum | null>(null);

    // monitoring overview
    const selectedExam = ref<Exam | null>(null);
    const monitoringOverviewData = ref<MonitoringOverview | null>(null);
    const batteryStatusDefaultColor = ref<string>("#f0f0f0");
    const wlanStatusDefaultColor = ref<string>("#f0f0f0");

    // monitoring clients
    const searchName = ref<string | null>(null);
    const isNoFilterSelected = ref<boolean>(false);
    const selectedMonitoringIds = ref<number[]>([]);
    const indicators = ref<Indicators | null>(null);
    const clientGroups = ref<ClientGroups | null>(null);
    const monitoringData = ref<Map<number, MonitoringRow>>(new Map());
    const staticClientDataList = ref<MonitoringStaticClientData | null>(null);
    const currentMonitoringQuery = ref<LocationQueryRaw>();
    const batteryIndicatorId = ref<number | null>(null);
    const wlanIndicatorId = ref<number | null>(null);
    const appSignatureKeys = ref<AppSignatureKeysWithGrantValues[] | null>(
        null,
    );
    const clientConnectionList = ref<SebClientConnection[] | null>(null);

    // monitoring detail
    const selectedSingleConn = ref<SingleConnection | null>(null);
    const clientGroupsSingle = ref<ClientGroup[]>([]);
    const pendingNotifications = ref<ClientNotification[]>([]);
    const clientLogEvents = ref<ClientEvent[] | null>(null);
    const logSearchField = ref<string | null>(null);

    const currentMonitoringDetailPagingOptions = ref<ServerTablePaging>();

    const clientConnectionsById = computed<Record<number, SebClientConnection>>(
        () => {
            const map: Record<number, SebClientConnection> = {};
            for (const c of clientConnectionList.value ?? []) {
                map[c.id] = c;
            }
            return map;
        },
    );

    function clearClientValues() {
        selectedMonitoringIds.value = [];
        indicators.value = null;
        clientGroups.value = null;
        monitoringData.value = new Map();
        staticClientDataList.value = null;
        batteryIndicatorId.value = null;
        wlanIndicatorId.value = null;
        clientLogEvents.value = null;
    }

    return {
        searchField,
        startDate,
        currentPagingOptions,
        activeTypeFilter,
        activeStatusFilter,
        selectedExam,
        monitoringOverviewData,
        batteryStatusDefaultColor,
        wlanStatusDefaultColor,

        searchName,
        indicators,
        appSignatureKeys,
        clientGroups,
        selectedMonitoringIds,
        isNoFilterSelected,
        monitoringData,
        staticClientDataList,
        selectedSingleConn,
        clientGroupsSingle,
        currentMonitoringQuery,
        pendingNotifications,
        batteryIndicatorId,
        wlanIndicatorId,
        clientLogEvents,
        currentMonitoringDetailPagingOptions,
        logSearchField,
        clientConnectionList,
        clientConnectionsById,

        clearClientValues,
    };
});

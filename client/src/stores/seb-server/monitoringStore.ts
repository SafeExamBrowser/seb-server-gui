import { defineStore } from "pinia";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { MonitoringRow } from "@/models/seb-server/monitoringClients";
import { LocationQuery } from "vue-router";

export const useMonitoringStore = defineStore("monitoring", () => {

    //exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const activeTypeFilter = ref<ExamTypeEnum | null>(null);
    const activeStatusFilter = ref<ExamStatusEnum | null>(null);

    //monitoring overview
    const selectedExam = ref<Exam | null>(null);
    const monitoringOverviewData = ref<MonitoringOverview | null>(null); 

    //monitoring clients
    const isNoFilterSelected = ref<boolean>(false);
    const selectedMonitoringIds = ref<number[]>([]);
    const indicators = ref<Indicators | null>(null);
    const clientGroups = ref<ClientGroups | null>(null);
    const monitoringData = ref<Map<number, MonitoringRow>>(new Map());
    const staticClientDataList = ref<MonitoringStaticClientData | null>(null);
    const currentMonitoringQuery = ref<{}>();
    const batteryIndicatorId = ref<number | null>(null);
    const wlanIndicatorId = ref<number | null>(null);


    //monitoring detail
    const selectedSingleConn = ref<SingleConnection | null>(null);
    const clientGroupsSingle = ref<ClientGroup[]>([]);
    const pendingNotifications = ref<ClientNotification[]>([]);



    function clearValues(){
        selectedMonitoringIds.value = [];
        indicators.value = null;
        clientGroups.value = null;
        monitoringData.value = new Map();
        staticClientDataList.value = null;
        batteryIndicatorId.value = null;
        wlanIndicatorId.value = null;
    }

    return {
        searchField,
        startDate,
        currentPagingOptions,
        activeTypeFilter,
        activeStatusFilter,
        selectedExam,
        monitoringOverviewData,
        indicators,
        clientGroups,
        selectedMonitoringIds,
        clearValues,
        isNoFilterSelected,
        monitoringData,
        staticClientDataList,
        selectedSingleConn,
        clientGroupsSingle,
        currentMonitoringQuery,
        pendingNotifications,
        batteryIndicatorId,
        wlanIndicatorId
    };
});
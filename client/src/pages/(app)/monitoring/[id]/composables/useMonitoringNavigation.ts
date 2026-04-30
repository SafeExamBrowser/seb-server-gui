import router from "@/router/router.ts";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import type {
    LocationQuery,
    LocationQueryRaw,
    LocationQueryValueRaw,
    RouteLocationAsRelative,
} from "vue-router";

function buildMonitoringRoute(examId: string, query?: LocationQueryRaw) {
    return {
        name: "/(app)/monitoring/[id]/",
        params: {
            id: examId,
        },
        query,
    } satisfies RouteLocationAsRelative<"/(app)/monitoring/[id]/">;
}

function addQueryParam(query: LocationQueryRaw) {
    void router.push({
        query,
    });
}

export function goToMonitoring(
    header: MonitoringHeaderEnum,
    value: string | boolean,
    examId: string,
) {
    const query: LocationQueryRaw = {
        [String(header)]: value as LocationQueryValueRaw,
    };

    void router.push(buildMonitoringRoute(examId, query));
}

export function goToMonitoringDetails(
    examId: string,
    connectionToken: string,
    query: LocationQueryRaw,
) {
    useMonitoringStore().currentMonitoringQuery = query;

    // This detail route is still legacy and does not exist in the generated
    // file-based route map yet, so this has to stay path-based for now.
    void router.push({
        path: `/monitoring/${examId}/details/${connectionToken}`,
    });
}

export function applyFilter(
    query: LocationQuery,
    filterType: MonitoringHeaderEnum,
    filterValue: string,
) {
    removeAllSelectedClients();

    const workingQuery = Object.fromEntries(
        Object.entries(query as Record<string, unknown>).filter(
            ([k]) => k !== MonitoringHeaderEnum.SHOW_ALL,
        ),
    ) as LocationQuery;

    if (
        typeof workingQuery[filterType] === "string" &&
        workingQuery[filterType].includes(filterValue)
    ) {
        removeQueryParam(workingQuery, filterType, filterValue);
        return;
    }

    if (typeof workingQuery[filterType] === "string") {
        filterValue = `${workingQuery[filterType]},${filterValue}`;
    }

    addQueryParam({
        ...workingQuery,
        [filterType]: filterValue,
    });
}

export function applyShowAllFilter() {
    removeAllSelectedClients();

    addQueryParam({
        [String(MonitoringHeaderEnum.SHOW_ALL)]: "true",
    });
}

function removeAllSelectedClients() {
    if (useMonitoringStore().selectedMonitoringIds.length > 0) {
        useMonitoringStore().selectedMonitoringIds = [];
    }
}

function removeQueryParam(
    query: LocationQuery,
    filterType: MonitoringHeaderEnum,
    filterValue: string,
) {
    const record: Record<string, string> = {};

    Object.entries(query).forEach(([k, v]) => {
        if (typeof v === "string") {
            record[k] = v;
        }
    });

    if (!(filterType in record)) {
        addQueryParam({ ...record });
        return;
    }

    const currentValue = record[filterType];
    const values = currentValue.split(",");
    const filteredValues = values.filter(
        (value) => value.trim() !== filterValue,
    );

    if (filteredValues.length === 0) {
        const rest = Object.fromEntries(
            Object.entries(record).filter(([k]) => k !== filterType),
        );
        addQueryParam({ ...rest });
        return;
    }

    addQueryParam({
        ...record,
        [filterType]: filteredValues.join(","),
    });
}

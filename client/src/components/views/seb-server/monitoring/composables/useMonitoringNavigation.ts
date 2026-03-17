import {
    LocationQuery,
    LocationQueryRaw,
    LocationQueryValueRaw,
} from "vue-router";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import * as navigation from "@/router/navigation.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { navigateTo } from "@/router/navigation.ts";
import * as constants from "@/utils/constants.ts";

export function goToMonitoring(
    header: MonitoringHeaderEnum,
    value: string | boolean,
    examId: string,
) {
    const query: LocationQueryRaw = {
        [String(header)]: value as LocationQueryValueRaw,
    };

    navigateTo(`${constants.MONITORING_CLIENTS_ROUTE}/${examId}`, query);
}

export function goToMonitoringDetails(
    examId: string,
    connectionToken: string,
    query: LocationQueryRaw,
) {
    useMonitoringStore().currentMonitoringQuery = query;
    navigateTo(
        constants.MONITORING_ROUTE +
            "/" +
            examId +
            "/details/" +
            connectionToken,
    );
}

export function applyFilter(
    query: LocationQuery,
    filterType: MonitoringHeaderEnum,
    filterValue: string,
) {
    // removes all selected clients (checkbox in table)
    removeAllSelectedClients();

    // make a copy without SHOW_ALL (no dynamic delete, no unused var)
    const workingQuery = Object.fromEntries(
        Object.entries(query as Record<string, unknown>).filter(
            ([k]) => k !== MonitoringHeaderEnum.SHOW_ALL,
        ),
    ) as LocationQuery;

    // if filter type & value exists in url --> remove value
    if (
        typeof workingQuery[filterType] === "string" &&
        (workingQuery[filterType] as string).includes(filterValue)
    ) {
        removeQueryParam(workingQuery, filterType, filterValue);
        return;
    }

    // if filter type exists in url --> add value
    if (typeof workingQuery[filterType] === "string") {
        filterValue = (workingQuery[filterType] as string) + "," + filterValue;
    }

    // if neither type or value exists  --> add value and type
    navigation.addQueryParam({
        ...workingQuery,
        [filterType]: filterValue,
    });
}

export function applyShowAllFilter() {
    removeAllSelectedClients();

    navigation.addQueryParam({
        [String(MonitoringHeaderEnum.SHOW_ALL)]: "true",
    });
}

//= =======table selection========
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

    // create object with only string values
    Object.entries(query).forEach(([k, v]) => {
        if (typeof v === "string") {
            record[k] = v;
        }
    });

    // if key doesn't exist, just forward what we have
    if (!(filterType in record)) {
        navigation.addQueryParam({ ...record });
        return;
    }

    const currentValue = record[filterType];
    const values = currentValue.split(",");
    const filteredValues = values.filter(
        (value) => value.trim() !== filterValue,
    );

    // build next object without using delete or unused bindings
    if (filteredValues.length === 0) {
        const rest = Object.fromEntries(
            Object.entries(record).filter(([k]) => k !== filterType),
        );
        navigation.addQueryParam({ ...rest });
        return;
    }

    navigation.addQueryParam({
        ...record,
        [filterType]: filteredValues.join(","),
    });
}

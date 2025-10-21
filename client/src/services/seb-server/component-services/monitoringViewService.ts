import * as monitoringService from "@/services/seb-server/api-services/monitoringService";
import * as generalUtils from "@/utils/generalUtils";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";
import { translate } from "@/utils/generalUtils";
import * as examViewService from "@/services/seb-server/component-services/examViewService";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";
import * as navigation from "@/router/navigation";
import {
    LocationQuery,
    LocationQueryRaw,
    LocationQueryValueRaw,
} from "vue-router";
import * as clientGroupViewService from "@/services/seb-server/component-services/clientGroupViewService";
import * as clientConnectionService from "@/services/seb-server/api-services/clientConnectionService";
import { OptionalParGetMonitoringClientLogs } from "@/models/seb-server/optionalParamters";
import {
    ClientEventResponse,
    ClientNotification,
    MonitoringConnections,
    MonitoringOverview,
    MonitoringStaticClientData,
    SingleConnection,
} from "@/models/seb-server/monitoring";
import { Exam } from "@/models/seb-server/exam";
import { ClientInstruction } from "@/models/seb-server/clientInstruction";
import { ClientGroup, ClientGroups } from "@/models/seb-server/clientGroup";
import {
    AppSignatureKey,
    AppSignatureKeysWithGrantValues,
    GrantedAppSignatureKey,
} from "@/models/seb-server/appSignatureKey";

//= ===============api===============
export async function getOverview(
    examId: string,
): Promise<MonitoringOverview | null> {
    try {
        return await monitoringService.getOverview(examId);
    } catch {
        return null;
    }
}

export async function getConnections(
    examId: string,
    optionalHeaders: object,
): Promise<MonitoringConnections | null> {
    try {
        return await monitoringService.getConnections(examId, optionalHeaders);
    } catch {
        return null;
    }
}

export async function getSingleConnection(
    examId: string,
    connectionToken: string,
): Promise<SingleConnection | null> {
    try {
        return await monitoringService.getSingleConnection(
            examId,
            connectionToken,
        );
    } catch {
        return null;
    }
}

export async function getSingleConnectionEvents(
    clientConnectionId: string,
    optionalParameters?: OptionalParGetMonitoringClientLogs,
): Promise<ClientEventResponse | null> {
    try {
        return await monitoringService.getSingleConnectionEvents(
            clientConnectionId,
            optionalParameters,
        );
    } catch {
        return null;
    }
}

export async function getStaticClientData(
    examId: string,
    modelIds: string,
): Promise<MonitoringStaticClientData | null> {
    try {
        return await monitoringService.getStaticClientData(examId, modelIds);
    } catch {
        return null;
    }
}

export async function getExamAndStore(examId: string) {
    const examResponse: Exam | null = await examViewService.getExam(examId);

    if (examResponse == null) {
        return;
    }
    useMonitoringStore().selectedExam = examResponse;
}

export async function getAskAndStore(examId: string) {
    const store = useMonitoringStore();

    const ask: AppSignatureKey[] | null =
        await examViewService.getExamAppSignatureKeys(examId);

    const grantedAsk: GrantedAppSignatureKey[] | null =
        await examViewService.getGrantedExamAppSignatureKeys(examId);

    const grantedByKey = new Map<string, GrantedAppSignatureKey>(
        (grantedAsk ?? []).map((g) => [g.keyValue, g]),
    );

    const merged: AppSignatureKeysWithGrantValues[] = (ask ?? []).map((a) => {
        const g = grantedByKey.get(a.keyValue);
        return {
            id: g?.id,
            institutionId: a.institutionId,
            examId: a.examId,
            keyValue: a.keyValue,
            connectionIds: a.connectionIds ?? {},
            keyType: g?.keyType,
            tag: g?.tag,
        };
    });

    store.appSignatureKeys = merged;

    const ids: number[] = Array.from(
        new Set(
            merged.flatMap((k) =>
                Object.keys(k.connectionIds ?? {}).map((id) => Number(id)),
            ),
        ),
    ).filter((n) => Number.isFinite(n));

    if (ids.length === 0) {
        store.clientConnectionList = [];
        return;
    }

    // 6) Fetch connections for those IDs
    const list = await clientConnectionService.getClientConnectionList(ids);
    store.clientConnectionList = list ?? [];
}

export async function registerInstruction(
    examId: string,
    clientInstruction: ClientInstruction,
): Promise<any | null> {
    try {
        return await monitoringService.registerInstruction(
            examId,
            clientInstruction,
        );
    } catch {
        return null;
    }
}

export async function getPendingNotifcations(
    examId: string,
    connectionToken: string,
): Promise<ClientNotification[] | null> {
    try {
        return await monitoringService.getPendingNotifcations(
            examId,
            connectionToken,
        );
    } catch {
        return null;
    }
}

export async function confirmNotification(
    examId: string,
    notificationId: string,
    connectionToken: string,
): Promise<any | null> {
    try {
        return await monitoringService.confirmNotification(
            examId,
            notificationId,
            connectionToken,
        );
    } catch {
        return null;
    }
}

export async function disableConnections(
    examId: string,
    connectionToken: string,
): Promise<any | null> {
    try {
        return await monitoringService.disableConnections(
            examId,
            connectionToken,
        );
    } catch {
        return null;
    }
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

//= =======table selection========
function removeAllSelectedClients() {
    if (useMonitoringStore().selectedMonitoringIds.length > 0) {
        useMonitoringStore().selectedMonitoringIds = [];
    }
}

//= ===============display / text logic===============
export function isMonitoringDisabled(): boolean {
    const selectedExam: Exam | null = useMonitoringStore().selectedExam;

    if (selectedExam == null) return true;

    const examStatus: ExamStatusEnum | null = generalUtils.findEnumValue(
        ExamStatusEnum,
        selectedExam.status,
    );
    const allowedExamStatuses: (ExamStatusEnum | null)[] = [
        ExamStatusEnum.RUNNING,
        ExamStatusEnum.TEST_RUN,
    ];

    return !allowedExamStatuses.includes(examStatus);
}

export function getMonitoringDisabledWarningText(): string {
    if (useMonitoringStore().selectedExam == null) {
        return translate("monitoringOverview.warning.notExist");
    }

    if (
        generalUtils.findEnumValue(
            ExamStatusEnum,
            useMonitoringStore().selectedExam?.status,
        ) !== ExamStatusEnum.RUNNING
    ) {
        return translate("monitoringOverview.warning.notRunning");
    }

    return "";
}

//= ===============navigation===============
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

//= ===============data prep functions===============
export async function getClientGroups(examId: string) {
    const clientGroupsResponse: ClientGroups | null =
        await clientGroupViewService.getClientGroups(examId);
    if (clientGroupsResponse == null) {
        return;
    }

    useMonitoringStore().clientGroups = clientGroupsResponse;
}

export function extractClientGroupNames(
    clientGroupIds: number[],
): ClientGroup[] {
    const clientGroups: ClientGroup[] = [];
    for (let i = 0; i < clientGroupIds.length; i++) {
        const clientGroup: ClientGroup | undefined =
            useMonitoringStore().clientGroups?.content.find(
                (clientGroup) => clientGroup.id === clientGroupIds[i],
            );

        if (clientGroup != null) {
            clientGroups.push(clientGroup);
        }
    }

    return clientGroups;
}

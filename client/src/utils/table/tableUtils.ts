import {
    ExamStatusEnum,
    ExamTypeEnum,
} from "@/models/seb-server/examFiltersEnum";
import { useTableStore } from "@/stores/store";
import { ServerTablePaging } from "@/models/types";
import {
    OptionalParGetExams,
    OptionalParGetMonitoringClientLogs,
} from "@/models/seb-server/optionalParamters";
import { OptionalParSearchSessions } from "@/models/screen-proctoring/optionalParamters";
import { BasicListParams, SortOrder } from "@/services/types";
import router from "@/router/router";
import type { RouteLocationAsRelative } from "vue-router";

//type ItemsLike = number | { length: number } | null | undefined;
type ItemsPerPageOption = { value: number; title: string };

type Clickable = { click: () => void };
type HeaderRefs =
    | { value?: Clickable[] | null }
    | Clickable[]
    | null
    | undefined;

export const defaultPageItems: number = 15;
export const itemsPerPageOptions: ItemsPerPageOption[] = [
    { value: 5, title: "5" },
    { value: 10, title: "10" },
    { value: 15, title: "15" },
];

export function handleTabKeyEvent(
    event: KeyboardEvent,
    action: "sort" | "navigate",
    key: number,
    optional?: { route?: RouteLocationAsRelative; headerRefs?: HeaderRefs },
) {
    if (event.key === "Enter" || event.key === " ") {
        if (action === "sort") {
            sortTable(key, optional?.headerRefs);
        }
        if (action === "navigate" && optional?.route) {
            void router.push(optional.route);
        }
    }
}

export function sortTable(key: number, headerRefs: HeaderRefs) {
    if (headerRefs && typeof headerRefs === "object" && "value" in headerRefs) {
        const arr = headerRefs.value;
        if (arr && arr[key]) arr[key].click();
        return;
    }

    // plain array
    if (Array.isArray(headerRefs) && headerRefs[key]) {
        headerRefs[key].click();
    }
}

export function assignExamSelectPagingOptions(
    serverTablePaging: ServerTablePaging,
    name: string | undefined,
    startTimestamp: number | null,
    activeTypeFilter: ExamTypeEnum | string | undefined,
    activeStatusFilter: ExamStatusEnum | string | undefined,
): OptionalParGetExams {
    const optionalParGetExams: OptionalParGetExams = {};

    optionalParGetExams.page_size = serverTablePaging.itemsPerPage;
    optionalParGetExams.page_number = serverTablePaging.page;

    if (activeTypeFilter != null) {
        optionalParGetExams.type = activeTypeFilter;
    }

    if (activeStatusFilter != null) {
        optionalParGetExams.status = activeStatusFilter;
    }

    if (name != null) {
        optionalParGetExams.quizName = name;
    }

    if (startTimestamp != null) {
        optionalParGetExams.start_timestamp_millis = startTimestamp;
    }

    if (serverTablePaging.sortBy.length !== 0) {
        let sortString: string = serverTablePaging.sortBy[0].key;
        if (serverTablePaging.sortBy[0].order === "desc") {
            sortString = "-" + sortString;
        }

        optionalParGetExams.sort = sortString;
    }

    return optionalParGetExams;
}

export function getSessionListIndex(day: string): number {
    const tableStore = useTableStore();
    return tableStore.isIpDisplayList.findIndex((i) => i.day === day);
}

export function assignPagingOptions(
    serverTablePaging: ServerTablePaging,
    pagingParameters: OptionalParSearchSessions,
): OptionalParSearchSessions {
    pagingParameters.pageSize = serverTablePaging.itemsPerPage;
    pagingParameters.pageNumber = serverTablePaging.page;

    if (serverTablePaging.sortBy.length !== 0) {
        let sortString: string = serverTablePaging.sortBy[0].key;
        if (serverTablePaging.sortBy[0].order === "desc") {
            sortString = "-" + sortString;
        }

        pagingParameters.sort = sortString;
    }

    return pagingParameters;
}

export function assignClientLogDetailsPagingOptions(
    serverTablePaging: ServerTablePaging,
    name: string | undefined,
    type: string | undefined,
): OptionalParGetMonitoringClientLogs {
    const optionalParGetMonitoringClientLogs: OptionalParGetMonitoringClientLogs =
        {};

    optionalParGetMonitoringClientLogs.page_size =
        serverTablePaging.itemsPerPage;
    optionalParGetMonitoringClientLogs.page_number = serverTablePaging.page;

    if (name != null && name !== "") {
        optionalParGetMonitoringClientLogs.text = name;
    }
    if (type != null && type !== "all") {
        optionalParGetMonitoringClientLogs.type = type;
    }
    if (serverTablePaging.sortBy.length !== 0) {
        let sortString: string = serverTablePaging.sortBy[0].key;
        if (serverTablePaging.sortBy[0].order === "desc") {
            sortString = "-" + sortString;
        }

        optionalParGetMonitoringClientLogs.sort = sortString;
    }

    return optionalParGetMonitoringClientLogs;
}

const sortOrderToSortString = (sortOrder: SortOrder): string => {
    return `${sortOrder.order === "desc" ? "-" : ""}${sortOrder.key}`;
};

// TODO @Andrei: most of the code in this file can be replaced by using `normaliseBasicListParams` (see `getExamTemplates` for an example)
export const normaliseBasicListParams = (basicListParams?: BasicListParams) => {
    if (!basicListParams) {
        return {};
    }

    return {
        page_number: basicListParams.pageNumber,
        page_size: basicListParams.pageSize,
        sort: basicListParams.sortOrder
            ? sortOrderToSortString(basicListParams.sortOrder)
            : undefined,
    };
};

export const toServerPageQuery = (paging: ServerTablePaging) => {
    const [sort] = paging.sortBy;
    const sortOrder: SortOrder | undefined =
        sort?.order === "asc" || sort?.order === "desc"
            ? { key: sort.key, order: sort.order }
            : undefined;

    return normaliseBasicListParams({
        pageNumber: paging.page,
        pageSize: paging.itemsPerPage,
        sortOrder,
    });
};

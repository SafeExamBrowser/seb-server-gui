import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import {navigateTo} from "@/router/navigation";
import { useTableStore } from "@/stores/store";


export function calcDefaultItemsPerPage(itemList: any): number {
    if (itemList == null || itemList.length == 0) {
        return 0;
    }

    let maxLength: number = 0;
    if(typeof itemList == "number"){
        maxLength = itemList;
    }else{
        maxLength = itemList.length;
    }

    if (maxLength < 5) return maxLength;
    if (maxLength < 10) return 5;
    if (maxLength < 15) return 10;

    return 15;
}

export function calcItemsPerPage(itemList: any): { value: number, title: string }[] {
    if (itemList == null || itemList.length == 0) {
        return [
            { value: 0, title: "0" }
        ];
    }

    let maxLength: number = 0;
    if(typeof itemList == "number"){
        maxLength = itemList;
    }else{
        maxLength = itemList.length;
    }

    if (maxLength <= 5) {
        return [
            { value: maxLength, title: maxLength.toString() }
        ];
    }

    if (maxLength <= 10) {
        return [
            { value: 5, title: '5' },
            { value: maxLength, title: maxLength.toString() }
        ];
    }

    if (maxLength <= 15) {
        return [
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: maxLength, title: maxLength.toString() }
        ];
    }

    return [
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 15, title: '15' },
    ];
}

export function handleTabKeyEvent(event: any, action: string, key: number, optional?: {path?: string, headerRefs?: any}){
    if (event.key == 'Enter' || event.key == ' ') {

        if(action == "sort"){
            sortTable(key, optional?.headerRefs)
        }

        if(action == "navigate"){
            navigateTo(optional?.path!);
        }
    }
}

export function sortTable(key: number, headerRefs: any){
    if(headerRefs.value != null){
        headerRefs.value[key].click();
        return;
    }

    if(headerRefs != null){
        headerRefs[key].click();
    }
}

export function assignQuizSelectPagingOptions(
    serverTablePaging: ServerTablePaging,
    name: string | null,
    startTimestamp: number | null,
    assessmentToolId: string | null,
    forceNewSearch: boolean,
): OptionalParGetQuizzes{

    const optionalParGetQuizzes: OptionalParGetQuizzes = { force_new_search: forceNewSearch };

    optionalParGetQuizzes.page_size = serverTablePaging.itemsPerPage;
    optionalParGetQuizzes.page_number = serverTablePaging.page;

    if(name != null){
        optionalParGetQuizzes.name = name;
    }

    if(startTimestamp != null){
        optionalParGetQuizzes.start_timestamp_millis = startTimestamp;
    }

    if(assessmentToolId != null){
        optionalParGetQuizzes.lms_setup = assessmentToolId;
    }


    if(serverTablePaging.sortBy.length != 0){
        let sortString: string = serverTablePaging.sortBy[0].key;
        if(serverTablePaging.sortBy[0].order == "desc"){
            sortString = "-" + sortString;
        }

        optionalParGetQuizzes.sort = sortString;
    }

    return optionalParGetQuizzes;
}

export function assignExamSelectPagingOptions
(
    serverTablePaging: ServerTablePaging,
    name: string | null,
    startTimestamp: number | null,
    activeTypeFilter: ExamTypeEnum | null | string,
    activeStatusFilter: ExamStatusEnum | null | string): OptionalParGetExams{

    const optionalParGetExams: OptionalParGetExams = {};

    optionalParGetExams.page_size = serverTablePaging.itemsPerPage;
    optionalParGetExams.page_number = serverTablePaging.page;

    if(activeTypeFilter != null){
        optionalParGetExams.type = activeTypeFilter;
    }

    if(activeStatusFilter != null){
        optionalParGetExams.status = activeStatusFilter;
    }


    if(name != null){
        optionalParGetExams.quizName = name;
    }

    if(startTimestamp != null){
        optionalParGetExams.start_timestamp_millis = startTimestamp;
    }


    if(serverTablePaging.sortBy.length != 0){
        let sortString: string = serverTablePaging.sortBy[0].key;
        if(serverTablePaging.sortBy[0].order == "desc"){
            sortString = "-" + sortString;
        }

        optionalParGetExams.sort = sortString;
    }

    return optionalParGetExams;
}

export function getSessionListIndex(day: string): number{
    const tableStore = useTableStore();
    return tableStore.isIpDisplayList.findIndex(i => i.day == day);
}

export function assignPagingOptions(serverTablePaging: ServerTablePaging, pagingParameters: OptionalParSearchSessions): OptionalParSearchSessions{
    pagingParameters.pageSize = serverTablePaging.itemsPerPage;
    pagingParameters.pageNumber = serverTablePaging.page;

    if(serverTablePaging.sortBy.length != 0){
        let sortString: string = serverTablePaging.sortBy[0].key;
        if(serverTablePaging.sortBy[0].order == "desc"){
            sortString = "-" + sortString;
        }

        pagingParameters.sort = sortString;
    }

    return pagingParameters;
}

export function assignUserAccountSelectPagingOptions(
    serverTablePaging: ServerTablePaging,
): OptionalParGetUserAccounts {
    const opt: OptionalParGetUserAccounts = {};

    opt.page_size = serverTablePaging.itemsPerPage;
    opt.page_number = serverTablePaging.page;

    if (serverTablePaging.sortBy.length !== 0) {
        let sortString = serverTablePaging.sortBy[0].key;
        if (serverTablePaging.sortBy[0].order === "desc") {
            sortString = "-" + sortString;
        }
        opt.sort = sortString;
    }

    return opt;
}


export function assignClientLogDetailsPagingOptions
(
    serverTablePaging: ServerTablePaging,
    name: string | null,
    type: string | null
): OptionalParGetMonitoringClientLogs {
    const optionalParGetMonitoringClientLogs: OptionalParGetMonitoringClientLogs = {};

    optionalParGetMonitoringClientLogs.page_size = serverTablePaging.itemsPerPage;
    optionalParGetMonitoringClientLogs.page_number = serverTablePaging.page;

    if (name != null && name !== "") {
        optionalParGetMonitoringClientLogs.text = name;
    }
    if (type != null && type !== "all") {
        optionalParGetMonitoringClientLogs.type = type;
    }
    if (serverTablePaging.sortBy.length != 0) {
        let sortString: string = serverTablePaging.sortBy[0].key;
        if (serverTablePaging.sortBy[0].order == "desc") {
            sortString = "-" + sortString;
        }

        optionalParGetMonitoringClientLogs.sort = sortString;
    }

    return optionalParGetMonitoringClientLogs;
}


export function assignAssessmentToolSelectPagingOptions(
    serverTablePaging: ServerTablePaging,
    selectedStatus: string | null,
    selectedType: LMSTypeEnum | null,
    selectedInstitutionId: string | null,
    name: string | null
): OptionalParGetAssessmentTool {
    const opt: OptionalParGetAssessmentTool = {};

    opt.page_size  = serverTablePaging.itemsPerPage;
    opt.page_number = serverTablePaging.page;

    if (serverTablePaging.sortBy?.length) {
        let sortString = serverTablePaging.sortBy[0].key;
        if (serverTablePaging.sortBy[0].order === "desc") sortString = "-" + sortString;
        opt.sort = sortString;
    }

    // filters
    opt.lms_type = selectedType ?? null;
    opt.active =
        selectedStatus === "Active" ? "true" :
            selectedStatus === "Inactive" ? "false" :
                null;
    opt.institutionId = selectedInstitutionId ?? null;

    // NEW: search
    if (name && name !== "") {
        opt.name = name;
    }

    return opt;
}






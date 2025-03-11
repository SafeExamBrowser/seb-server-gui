import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
import {navigateTo} from "@/router/navigation";

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
    assessmentToolId: string | null
): OptionalParGetQuizzes{
    
    const optionalParGetQuizzes: OptionalParGetQuizzes = {};

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
    name: string | null, startTimestamp: string | null, 
    activeTypeFilter: ExamTypeEnum | null, 
    activeStatusFilter: ExamStatusEnum | null): OptionalParGetExams{
    
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
        optionalParGetExams.quizStartTime = startTimestamp;
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
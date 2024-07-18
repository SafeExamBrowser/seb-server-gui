import {navigateTo} from "@/router/navigation";
import {useTableStore} from "@/stores/app";

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

    if (maxLength < 5) {
        return [
            { value: maxLength, title: maxLength.toString() }
        ];
    }

    if (maxLength < 10) {
        return [
            { value: 5, title: '5' },
            { value: maxLength, title: maxLength.toString() }
        ];
    }

    if (maxLength < 15) {
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
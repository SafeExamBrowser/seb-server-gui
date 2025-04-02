import { ClientGroupEnum, ClientOSEnum } from "@/models/clientGroupEnum";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
import { useI18n } from "vue-i18n";

export function translate(key: string | null | undefined, i18nParam?: any | null): string{
    if(key == null || key == ""){
        return "";
    }

    //if called outside of a setup context the i18n instance must be passed manually 
    if(i18nParam != null){
        return i18nParam.t(key);
    }

    return useI18n().t(key);
}

export function findEnumValue<T extends Record<string, string | number>>(enumObj: T, value: string | undefined | null): T[keyof T] | null {
    if(value == null){
        return null;
    }

    return Object.values(enumObj).includes(value) ? value as T[keyof T] : null;
}


// export function getTypeFilterName(status: ExamTypeEnum | null, i18nParam: any | null): string{
//     if(status == ExamTypeEnum.BYOD){
//         return translate("typeFilters.byod", i18nParam);
//     }

//     if(status == ExamTypeEnum.MANAGED){
//         return translate("typeFilters.managed", i18nParam);
//     }

//     if(status == ExamTypeEnum.UNDEFINED){
//         return translate("typeFilters.undefined", i18nParam);
//     }

//     if(status == ExamTypeEnum.VDI){
//         return translate("typeFilters.vdi", i18nParam);
//     }

//     return ""; 
// }


// export function getExamStatusFilterName(status: ExamStatusEnum | null, i18nParam: any | null): string{
//     if(status == ExamStatusEnum.RUNNING){
//         return translate("statusFilters.running", i18nParam);
//     }

//     if(status == ExamStatusEnum.FINISHED){
//         return translate("statusFilters.finished", i18nParam);
//     }

//     if(status == ExamStatusEnum.UP_COMING){
//         return translate("statusFilters.upComing", i18nParam);
//     }

//     if(status == ExamStatusEnum.TEST_RUN){
//         return translate("statusFilters.testRun", i18nParam);
//     }

//     if(status == ExamStatusEnum.ARCHIVED){
//         return translate("statusFilters.archived", i18nParam);
//     }

//     return ""; 
// }


export function getExamStatusFilterColor(status: ExamStatusEnum | null): string{
    if(status == ExamStatusEnum.RUNNING){
        return "green";
    }

    if(status == ExamStatusEnum.FINISHED){
        return "red";
    }

    if(status == ExamStatusEnum.UP_COMING){
        return "orange";
    }

    if(status == ExamStatusEnum.TEST_RUN){
        return "blue";
    }

    //ExamStatusEnum.ARCHIVED has no color
    return "";
}

// export function getClientGroupName(clientGroup: ClientGroupEnum | null, i18nParam: any | null): string{
//     if(clientGroup == ClientGroupEnum.NONE){
//         return translate("clientGroups.names.none", i18nParam);
//     }

//     if(clientGroup == ClientGroupEnum.IP_V4_RANGE){
//         return translate("clientGroups.names.ip", i18nParam);
//     }

//     if(clientGroup == ClientGroupEnum.CLIENT_OS){
//         return translate("clientGroups.names.os", i18nParam);
//     }

//     if(clientGroup == ClientGroupEnum.NAME_ALPHABETICAL_RANGE){
//         return translate("clientGroups.names.alphabetical", i18nParam);
//     }

//     return ""; 
// }

export function getClientGroupDescription(clientGroup: ClientGroupEnum | null, i18nParam: any | null): string{
    if(clientGroup == ClientGroupEnum.IP_V4_RANGE){
        return translate("clientGroups.description.ip[0]", i18nParam);
    }

    if(clientGroup == ClientGroupEnum.CLIENT_OS){
        return translate("clientGroups.description.os[0]", i18nParam);
    }

    if(clientGroup == ClientGroupEnum.NAME_ALPHABETICAL_RANGE){
        return translate("clientGroups.description.alphabetical[0]", i18nParam);
    }

    return ""; 
}

// export function getClientOSName(clientOS: ClientOSEnum | null, i18nParam: any | null): string{
//     if(clientOS == ClientOSEnum.NONE){
//         return translate("clientGroups.osNames.none", i18nParam);
//     }

//     if(clientOS == ClientOSEnum.WINDOWS){
//         return translate("clientGroups.osNames.windows", i18nParam);
//     }

//     if(clientOS == ClientOSEnum.MAC_OS){
//         return translate("clientGroups.osNames.macOs", i18nParam);
//     }

//     if(clientOS == ClientOSEnum.I_OS){
//         return translate("clientGroups.osNames.iOs", i18nParam);
//     }

//     if(clientOS == ClientOSEnum.IPAD_OS){
//         return translate("clientGroups.osNames.iPadOs", i18nParam);
//     }

//     if(clientOS == ClientOSEnum.I_OS_OR_IPAD_OS){
//         return translate("clientGroups.osNames.iOsIpadOs", i18nParam);
//     }

//     return ""; 
// }

export function createStringIdList(ids: number[]): string{
    let stringIdList = "";
    if(ids.length == 0){
        return stringIdList;
    }

    for(let i = 0; i < ids.length; i++){
        stringIdList += ids[i] + ","
    }

    stringIdList = stringIdList.substring(0, stringIdList.length-1);

    return stringIdList
}
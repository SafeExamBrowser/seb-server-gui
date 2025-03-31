import { ClientGroupEnum, ClientOSEnum } from "@/models/clientGroupEnum";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";


export function findEnumValue<T extends Record<string, string | number>>(enumObj: T, value: string | undefined | null): T[keyof T] | null {
    if(value == null){
        return null;
    }

    return Object.values(enumObj).includes(value) ? value as T[keyof T] : null;
}


export function getTypeFilterName(status: ExamTypeEnum | null): string{
    if(status == ExamTypeEnum.BYOD){
        return "BYOD";
    }

    if(status == ExamTypeEnum.MANAGED){
        return "Managed Devices";
    }

    if(status == ExamTypeEnum.UNDEFINED){
        return "Not Defined";
    }

    if(status == ExamTypeEnum.VDI){
        return "VDI (Virtual Desktop Infrastructure)";
    }

    return ""; 
}


export function getExamStatusFilterName(status: ExamStatusEnum | null): string{
    if(status == ExamStatusEnum.RUNNING){
        return "Running";
    }

    if(status == ExamStatusEnum.FINISHED){
        return "Finished";
    }

    if(status == ExamStatusEnum.UP_COMING){
        return "Up Coming";
    }

    if(status == ExamStatusEnum.TEST_RUN){
        return "Test Run";
    }

    if(status == ExamStatusEnum.ARCHIVED){
        return "Archived";
    }

    return ""; 
}


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

export function getClientGroupName(clientGroup: ClientGroupEnum | null): string{
    if(clientGroup == ClientGroupEnum.NONE){
        return "none";
    }

    if(clientGroup == ClientGroupEnum.IP_V4_RANGE){
        return "IP v4 Range";
    }

    if(clientGroup == ClientGroupEnum.CLIENT_OS){
        return "SEB Client OS";
    }

    if(clientGroup == ClientGroupEnum.NAME_ALPHABETICAL_RANGE){
        return "Alphabetical User Name Range";
    }

    return ""; 
}

export function getClientGroupDescription(clientGroup: ClientGroupEnum | null): string{
    if(clientGroup == ClientGroupEnum.IP_V4_RANGE){
        return `With IP v4 range groups you can group the SEB client connections within a IP ranges.
                Every SEB client that is connected with a given client IP address that is within the
                defined range (including start and end address) belongs to this group.
                This is mostly useful if you have dedicated managed devices where you know
                the IP ranges for e.g. your computer rooms.`;
    }

    if(clientGroup == ClientGroupEnum.CLIENT_OS){
        return `With SEB Client groups you can group the SEB client connections within the
                operating system they are running on.
                For this grouping type there is a defined SEB OS type for each
                supported OS; Windows, MacOS and iOS.
                This is mostly useful if you want to monitor and manage
                the SEB clients by different operating system types to give respective support.`;
    }

    if(clientGroup == ClientGroupEnum.NAME_ALPHABETICAL_RANGE){
        return `With this group you can define an alphabetical range to collect SEB Clients by user session name.
                The range is defined by an inclusive starting letter and an inclusive end letter.
                There is no additional check if your defined groups covering the whole alphabet
                Furthermore since the user session name can change during the SEB Connection phase, the group belonging of a SEB Client can change too.`;
    }

    return ""; 
}

export function getClientOSName(clientOS: ClientOSEnum | null): string{
    if(clientOS == ClientOSEnum.NONE){
        return "none";
    }

    if(clientOS == ClientOSEnum.WINDOWS){
        return "Windows";
    }

    if(clientOS == ClientOSEnum.MAC_OS){
        return "macOS";
    }

    if(clientOS == ClientOSEnum.I_OS){
        return "iOS";
    }

    if(clientOS == ClientOSEnum.IPAD_OS){
        return "iPadOS";
    }

    if(clientOS == ClientOSEnum.I_OS_OR_IPAD_OS){
        return "iOS/iPadOS";
    }

    return ""; 
}

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
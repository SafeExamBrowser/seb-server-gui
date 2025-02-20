import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";


export function findEnumValue<T extends Record<string, string | number>>(enumObj: T, value: string): T[keyof T] | null {
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

    if(status == ExamStatusEnum.ARCHIVED){
        return "purple";
    }

    //ExamStatusEnum.TEST_RUN has no color
    return "";
}
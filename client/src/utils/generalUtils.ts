import { ClientGroupEnum, ClientOSEnum } from "@/models/seb-server/clientGroupEnum";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { LMSFeatureEnum, LMSTypeEnum, LMSTypeFeatureMappig } from "@/models/seb-server/assessmentToolEnums";
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

export function translateWithBR(key: string | null | undefined, i18nParam?: any | null): string{
    return translate(key, i18nParam).replace(/\n/g, '<br />');
}

export function findEnumValue<T extends Record<string, string | number>>(enumObj: T, value: string | undefined | null): T[keyof T] | null {
    if(value == null){
        return null;
    }

    return Object.values(enumObj).includes(value) ? value as T[keyof T] : null;
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

export function createStringCommaList(values: number[] | string[]): string{
    let stringIdList = "";
    if(values.length == 0){
        return stringIdList;
    }

    for(let i = 0; i < values.length; i++){
        stringIdList += values[i] + ","
    }

    stringIdList = stringIdList.substring(0, stringIdList.length-1);

    return stringIdList
}

export function createNumberIdList(ids: string | null | undefined): number[]{
    //checks if string is null or if it includes comma or numbers
    if(ids == null || !(/^[0-9,]*$/.test(ids))){
        return [];
    }

    return ids.split(",").map(id => parseInt(id));
}

export function hasLMSFeature(lmsTypeString: string, feature: LMSFeatureEnum): boolean {
    let type: LMSTypeEnum | null = findEnumValue(LMSTypeEnum, lmsTypeString);
    if(type == null){
        return false;
    }

    let features: LMSFeatureEnum[] | undefined = LMSTypeFeatureMappig.get(type);
    if(features == null){
        return false;
    }

    return features.includes(feature);
}

export function stringToBoolean(booleanValue: string): boolean{
    if(booleanValue == "true"){
        return true;
    }

    if(booleanValue == "false"){
        return false;
    }

    return false;
}

export function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
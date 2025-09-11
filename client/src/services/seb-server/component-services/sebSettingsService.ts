
import * as sebSettingService from "@/services/seb-server/api-services/sebSettingsService";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";

export async function getExamConfigMapping(examId: string): Promise<ExamConfigMapping[] | null> {
    try{
        return await sebSettingService.getExamConfigMapping(examId);
    }catch(error){
        return null;
    }
}

export async function getActiveSEBClients(examId: string): Promise<number | null>{
    try{
        return await sebSettingService.getActiveSEBClients(examId);
    }catch(error){
        return null;
    }
}

export async function getViewSettings(viewType: ViewType, id: string, forExam: boolean): Promise<SEBSettingsView | null>{
    try{
        return await sebSettingService.getView(viewType, id, forExam);
    }catch(error){
        return null;
    }
}

export async function updateSEBSettingValue(id: string, valueId: String, value: string, forExam: boolean): Promise<SEBSettingsValue | null>{
    try{
        return await sebSettingService.updateSEBSettingValue(id, valueId, value, forExam);
    }catch(error){
        return null;
    }
}

export async function newSEBSettingTableRow(id: string, settingName: string, forExam: boolean): Promise<SEBSettingsTableRowValues | null> {
    try{
        return await sebSettingService.addTableRow(id, settingName, forExam);
    }catch(error){
        return null;
    }
}

export async function deleteSEBSettingTableRow(id: string, settingName: string, rowIndex: number, forExam: boolean): Promise<SEBSettingsTableRowValues[] | null>{
    try{
        return await sebSettingService.deleteTableRow(id, settingName, rowIndex, forExam);
    }catch(error){
        return null;
    }
}

export async function publish(id: string, forExam: boolean): Promise<SEBSettingsValue | null>{
    try{
        return await sebSettingService.publish(id, forExam);
    }catch(error){
        return null;
    }
}

export async function undoChanges(id: string, forExam: boolean): Promise<SEBSettingsValue | null>{
    try{
        return await sebSettingService.undoChanges(id, forExam);
    }catch(error){
        return null;
    }
}
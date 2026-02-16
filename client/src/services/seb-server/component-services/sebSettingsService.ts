import * as sebSettingService from "@/services/seb-server/api-services/sebSettingsService";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import {
    ExamConfigMapping,
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    SEBSettingsView,
} from "@/models/seb-server/sebSettings";

export async function getExamConfigMapping(
    examId: string,
): Promise<ExamConfigMapping[] | null> {
    try {
        return await sebSettingService.getExamConfigMapping(examId);
    } catch {
        return null;
    }
}

export async function getActiveSEBClients(
    examId: string,
): Promise<number | null> {
    try {
        return await sebSettingService.getActiveSEBClients(examId);
    } catch {
        return null;
    }
}

export async function getViewSettings(
    viewType: ViewType,
    id: string,
): Promise<SEBSettingsView | null> {
    try {
        return await sebSettingService.getView(viewType, id);
    } catch {
        return null;
    }
}

export async function updateSEBSettingValue(
    id: string,
    valueId: string,
    value: string,
    forExam: boolean,
): Promise<SEBSettingsValue | null> {
    try {
        return await sebSettingService.updateSEBSettingValue(
            id,
            valueId,
            value,
            forExam,
        );
    } catch {
        return null;
    }
}

export async function newSEBSettingTableRow(
    id: string,
    settingName: string,
): Promise<SEBSettingsTableRowValues | null> {
    try {
        return await sebSettingService.addTableRow(id, settingName);
    } catch {
        return null;
    }
}

export async function deleteSEBSettingTableRow(
    id: string,
    settingName: string,
    rowIndex: number,
): Promise<SEBSettingsTableRowValues[] | null> {
    try {
        return await sebSettingService.deleteTableRow(
            id,
            settingName,
            rowIndex,
        );
    } catch {
        return null;
    }
}

export async function publish(
    id: string,
    forExam: boolean,
): Promise<SEBSettingsValue | null> {
    try {
        return await sebSettingService.publish(id, forExam);
    } catch {
        return null;
    }
}

export async function undoChanges(
    id: string,
    forExam: boolean,
): Promise<SEBSettingsValue | null> {
    try {
        return await sebSettingService.undoChanges(id, forExam);
    } catch {
        return null;
    }
}

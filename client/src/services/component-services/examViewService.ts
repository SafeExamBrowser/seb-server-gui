import * as examService from "@/services/api-services/examService";
import * as examTemplateService from "@/services/api-services/examTemplateService";
import * as examSEBSettingService from "@/services/api-services/examSEBSettingService";
import * as configurationService from "@/services/api-services/configurationService";
import * as screenProctoringService from "@/services/api-services/screenProctoringService";
import * as monitoringService from "@/services/api-services/monitoringService";
import * as generalUtils from "@/utils/generalUtils";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
import * as timeUtils from "@/utils/timeUtils";


//=============api==============
export async function getExam(id: string): Promise<Exam | null>{
    try{
        return await examService.getExam(id);    
    }catch(error){
        return null;
    }
}

export async function getExamTemplate(id: string): Promise<ExamTemplate | null>{
    try{
        return await examTemplateService.getExamTemplate(id);    
    }catch(error){
        return null;
    }
}

export async function deleteExam(id: string): Promise<any | null>{
    try{
        return await examService.deleteExam(id);    
    }catch(error){
        return null;
    }
}

export async function getExams(optionalParGetExams?: OptionalParGetExams): Promise<Exams | null>{
    try{
        return await examService.getExams(optionalParGetExams);    
    }catch(error){
        return null;
    }
}

export async function updateExam(examId: string, exam: Exam): Promise<Exam | null>{
    try{
        return await examService.updateExam(examId, exam);        
    }catch(error){
        return null;
    }
}

export async function getConnectionConfigurations(): Promise<ConnectionConfigurations | null>{
    try{
        return await configurationService.getConnectionConfigurations("true");
    }catch(error){
        return null;
    }
}

export async function downloadExamConfig(examId: string, connectionId: string): Promise<any>{
    try{
        return await configurationService.downloadExamConfig(examId, connectionId);
    }catch(error){
        return null;
    }
}

export async function archiveExam(id: string): Promise<Exam | null>{
    try{
        return await examService.archiveExam(id);    
    }catch(error){
        return null;
    }
}

export async function saveScreenProctoringSettings(id: string, screenProctoringSettings: ScreenProctoringSettings): Promise<Exam | null>{
    try{
        return await screenProctoringService.saveScreenProctoringSettings(id, screenProctoringSettings);
    }catch(error){
        return null;
    }
}

export async function applyTestRun(id: string): Promise<Exam | null>{
    try{
        return await monitoringService.applyTestRun(id);
    }catch(error){
        return null;
    }
}

export async function applyScreenProctoringGroups(id: string, spsSEBGroupsSelection: string): Promise<Exam | null>{
    try{
        return await screenProctoringService.applyScreenProctoringGroups(id, spsSEBGroupsSelection);
    }catch(error){
        return null;
    }
}

export async function activateScreenProctoring(id: string, enableScreenProctoring: boolean): Promise<Exam | null>{
    try{
        return await screenProctoringService.activateScreenProctoring(id, enableScreenProctoring);
    }catch(error){
        return null;
    }
}
//==============================

//======SEB lock================

export async function applySEBLock(id: string, enableSEBLock: boolean): Promise<Exam | null>{
    try{
        return await examService.applySEBLock(id, enableSEBLock);
    }catch(error){
        return null;
    }
}

//==============================

//======screen proctoring=======
export function createDefaultScreenProctoringSettings(enable: boolean, examId: number, groupName: string): ScreenProctoringSettings{
    return {
        id: examId,
        enableScreenProctoring: enable,
        spsCollectingStrategy: "EXAM",
        spsCollectingGroupName: groupName,
        bundled: false,
        changeStrategyConfirm: false
    };
}


//======enable/disable==========
export function isExamFunctionalityDisabled(allowedExamStatus: ExamStatusEnum[], examStatusString: string | undefined): boolean{
    if(examStatusString == null){
        return true;
    }

    const examStatus: ExamStatusEnum | null = generalUtils.findEnumValue(ExamStatusEnum, examStatusString);
    if (examStatus == null) {
        return true;
    }
    
    if(!allowedExamStatus.includes(examStatus)){
        return true;
    }

    return false;
}


//===============exam connection config logic====================
export function createDownloadLink(examName: string | undefined, blob: any){
    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", getExamConfigFileName(examName));
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function getExamConfigFileName(examName: string | undefined): string{
    if(examName == null){
        return "";
    }

    examName = examName?.replaceAll(" ", "_");

    return `${examName}_${timeUtils.getCurrentDateString()}.seb`;
}


//======SEB Settings=======
export async function getApplicationViewSettings(examId: string): Promise<SEBSettingsView | null>{
    try{
        return await examSEBSettingService.getApplicationView(examId);
    }catch(error){
        return null;
    }
}

export async function updateSEBSettingValue(examId: string, valueId: String, value: string): Promise<SEBSettingsValue | any>{
    try{
        return await examSEBSettingService.updateSEBSettingValue(examId, valueId, value);
    }catch(error){
        return null;
    }
}

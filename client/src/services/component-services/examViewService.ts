import * as examService from "@/services/api-services/examService";
import * as examTemplateService from "@/services/api-services/examTemplateService";
import * as configurationService from "@/services/api-services/configurationService";
import * as screenProctoringService from "@/services/api-services/screenProctoringService";


//=============api==============
export async function getExam(id: string): Promise<Exam | null>{
    try{
        return await examService.getExam(id);    
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getExamTemplate(id: string): Promise<ExamTemplate | null>{
    try{
        return await examTemplateService.getExamTemplate(id);    
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function deleteExam(id: string): Promise<any>{
    try{
        return await examService.deleteExam(id);    
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getExams(optionalParGetExams?: OptionalParGetExams): Promise<Exams | null>{
    try{
        return await examService.getExams(optionalParGetExams);    
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function updateExam(examId: string, exam: Exam): Promise<Exam | null>{
    try{
        return await examService.updateExam(examId, exam);        
    }catch(error: any){
        console.error(error);
        return null;
    }
}

export async function getConnectionConfigurations(): Promise<ConnectionConfigurations | null>{
    try{
        return await configurationService.getConnectionConfigurations("true");
    }catch(error: any){
        console.error(error);
        return null;
    }
}

export async function downloadExamConfig(examId: string, connectionId: string): Promise<any>{
    try{
        return await configurationService.downloadExamConfig(examId, connectionId);
    }catch(error: any){
        console.error(error);
        return null;
    }
}

export async function archiveExam(id: string): Promise<Exam | null>{
    try{
        return await examService.archiveExam(id);    
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function saveScreenProctoringSettings(id: string, screenProctoringSettings: ScreenProctoringSettings): Promise<Exam | null>{
    try{
        return await screenProctoringService.saveScreenProctoringSettings(id, screenProctoringSettings);
    }catch(error){
        console.error(error);
        return null;
    }
}
//==============================


//=============screen proctoring==============

export function createDefaultScreenProctoringSettings(examId: number, groupName: string): ScreenProctoringSettings{
    return {
        id: examId,
        enableScreenProctoring: true,
        spsCollectingStrategy: "EXAM",
        spsCollectingGroupName: groupName,
        bundled: false,
        changeStrategyConfirm: false
    };
}
import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as examService from "../../services/seb-server/exam.service";
import * as apiService from "../../services/seb-server/api.service";

export async function getExam(req: Request, res: Response){
    try{
        const [exams, status] = await examService.getExam(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getExamConfigurationMap(req: Request, res: Response){
    try{
        const [examConfigurationMap, status] = await examService.getExamConfigurationMap(req.headers.authorization, req.params.id, req.query.optionalParameters);
        return res.status(status).json(examConfigurationMap);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function createExam(req: Request, res: Response){
    try{
        const [newExam, status] = await examService.createExam(req.headers.authorization, req.body);
        return res.status(status).json(newExam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function deleteExam(req: Request, res: Response){
    try{
        const [exams, status] = await examService.deleteExam(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function updateExam(req: Request, res: Response){
    try{
        const [updatedExam, status] = await examService.updateExam(req.headers.authorization, req.body);
        return res.status(status).json(updatedExam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getExams(req: Request, res: Response){
    try{
        const [exams, status] = await examService.getExams(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getExamsForMonitoring(req: Request, res: Response){
    try{
        const [exams, status] = await examService.getExamsForMonitoring(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function archiveExam(req: Request, res: Response){
    try{
        const [exams, status] = await examService.archiveExam(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function putSEBLock(req: Request, res: Response){
    try{
        const [exams, status] = await examService.putSEBLock(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function checkSEBLock(req: Request, res: Response){
    try{
        const [exams, status] = await examService.checkSEBLock(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}



export async function deleteSEBLock(req: Request, res: Response){
    try{
        const [exams, status] = await examService.deleteSEBLock(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
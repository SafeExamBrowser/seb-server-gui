import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as examService from "../../services/seb-server/exam.service";
import * as apiService from "../../services/seb-server/api.service";


export async function getGrantedExamAppSignatureKeys(req: Request, res: Response){
    try{
        const [AppSignatureKeys, status] = await examService.getGrantedExamAppSignatureKeys(req.headers.authorization, req.params.id);
        return res.status(status).json(AppSignatureKeys);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function grantExamAppSignatureKey(req: Request, res: Response) {
    try {
        const { parentId, id } = req.params;
        const tag = typeof req.query.tag === "string" ? req.query.tag : undefined;

        const [AppSignatureKey, status] = await examService.grantExamAppSignatureKey(
            req.headers.authorization as string,
            parentId,
            id,
            tag
        );
        return res.status(status).json(AppSignatureKey);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function removeGrantExamAppSignatureKey(req: Request, res: Response){
    try{
        const [AppSignatureKey, status] = await examService.removeGrantExamAppSignatureKey(req.headers.authorization, req.params.parentId, req.params.id);
        return res.status(status).json(AppSignatureKey);

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
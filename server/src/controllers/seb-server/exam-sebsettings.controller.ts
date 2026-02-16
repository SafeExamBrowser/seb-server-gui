import {Request, Response} from "express";
import * as examSEBSettingsService from "../../services/seb-server/exam-sebsettings.service";
import * as apiService from "../../services/seb-server/api.service";

export async function publishSettings(req: Request, res: Response){
    try{
        const [exam, status] = await examSEBSettingsService.publishSettings(req.headers.authorization, req.params.id);
        return res.status(status).json(exam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function undoChanges(req: Request, res: Response){
    try{
        const [exam, status] = await examSEBSettingsService.undoChanges(req.headers.authorization, req.params.id);
        return res.status(status).json(exam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
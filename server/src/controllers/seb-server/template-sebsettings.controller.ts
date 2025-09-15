import {Request, Response} from "express";
import * as templateSEBSettingsService from "../../services/seb-server/template-sebsettings.service";
import * as apiService from "../../services/seb-server/api.service";

export async function getView(req: Request, res: Response){
    try{
        const [exams, status] = await templateSEBSettingsService.getView(req.headers.authorization, req.params.id, req.params.viewType);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function addTableRow(req: Request, res: Response){
    try{
        const [exams, status] = await templateSEBSettingsService.addTableRow(req.headers.authorization, req.params.id, req.params);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function deleteTableRow(req: Request, res: Response){
    try{
        const [exams, status] = await templateSEBSettingsService.deleteTableRow(req.headers.authorization, req.params.id, req.params);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function updateSEBSetting(req: Request, res: Response){
    try{
        const [exams, status] = await templateSEBSettingsService.updateSEBSettingsValue(req.headers.authorization, req.params.id, req.body.valueId, req.body.value);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
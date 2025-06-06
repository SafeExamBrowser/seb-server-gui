import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as examSEBSettingsService from "../../services/seb-server/exam-sebsettings.service";
import * as apiService from "../../services/seb-server/api.service";

export async function getExamConfigMapping(req: Request, res: Response){
    try{
        const [configMapping, status] = await examSEBSettingsService.getExamConfigMapping(req.headers.authorization, req.params.id);
        return res.status(status).json(configMapping);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getApplicationView(req: Request, res: Response){
    try{
        const [exams, status] = await examSEBSettingsService.getApplicationView(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getNetworkView(req: Request, res: Response){
    try{
        const [exams, status] = await examSEBSettingsService.getNetworkView(req.headers.authorization, req.params.id);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function addTableRow(req: Request, res: Response){
    try{
        const [exams, status] = await examSEBSettingsService.addTableRow(req.headers.authorization, req.params.id, req.params);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function deleteTableRow(req: Request, res: Response){
    try{
        const [exams, status] = await examSEBSettingsService.deleteTableRow(req.headers.authorization, req.params.id, req.params);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function updateSEBSetting(req: Request, res: Response){
    try{
        const [exams, status] = await examSEBSettingsService.updateSEBSettingsValue(req.headers.authorization, req.params.id, req.body.valueId, req.body.value);
        return res.status(status).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
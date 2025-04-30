import * as apiService from "../../services/seb-server/api.service";
import * as configurationService from "../../services/seb-server/configuration.service";
import {Request, Response} from "express";


export async function downloadExamConfig(req: Request, res: Response){
    try{
        const [examConfig, status] = await configurationService.downloadExamConfig(req.headers.authorization, req.params.id, req.query.examId);
        return res.status(status).send(examConfig);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getConnectionConfigurations(req: Request, res: Response){
    try{
        const [connectionConfigurations, status] = await configurationService.getConnectionConfigurations(req.headers.authorization, req.query.isActive);
        return res.status(status).json(connectionConfigurations);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
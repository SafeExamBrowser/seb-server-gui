import * as apiService from "../../services/seb-server/api.service";
import * as configurationService from "../../services/seb-server/configuration.service";
import {Request, Response} from "express";
import * as assessmentToolService from "../../services/seb-server/assessment-tool.service";


export async function createConnectionConfiguration(req: Request, res: Response) {
    try {
        const [connectionConfiguration, status] = await configurationService.createConnectionConfiguration(req.headers.authorization, req.body);
        return res.status(status).json(connectionConfiguration);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function deleteConnectionConfiguration(req: Request, res: Response){
    try{
        const [assessmentTool, status] = await configurationService.deleteConnectionConfiguration(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function editConnectionConfiguration(req: Request, res: Response) {
    try {
        const [connectionConfiguration, status] = await configurationService.editConnectionConfiguration(req.headers.authorization, req.body);
        return res.status(status).json(connectionConfiguration);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}
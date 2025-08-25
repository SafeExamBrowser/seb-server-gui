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

export async function downloadExamConfig(req: Request, res: Response){
    try{
        const [examConfig, status] = await configurationService.downloadExamConfig(req.headers.authorization, req.params.id, req.query.examId);
        return res.status(status).send(examConfig);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getConnectionConfigurationsActive(req: Request, res: Response){
    try{
        const [connectionConfigurations, status] = await configurationService.getConnectionConfigurationsActive(req.headers.authorization, req.query.isActive);
        return res.status(status).json(connectionConfigurations);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}



export async function getConnectionConfigurations(req: Request, res: Response){
    try{
        const [assessmentTools, status] = await configurationService.getConnectionConfigurations(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(assessmentTools);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getConnectionConfiguration(req: Request, res: Response){
    try{
        const [assessmentTool, status] = await configurationService.getConnectionConfiguration(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function deactivateConnectionConfiguration(req: Request, res: Response) {
    try {
        const [assessmentTool, status] = await configurationService.deactivateConnectionConfiguration(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}
export async function activateConnectionConfiguration(req: Request, res: Response) {
    try {
        const [assessmentTool, status] = await configurationService.activateConnectionConfiguration(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);
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
import * as assessmentToolService from "../../services/seb-server/assessment-tool.service";
import * as apiService from "../../services/seb-server/api.service";
import {Request, Response} from "express";
import * as userAccountService from "../../services/seb-server/user-account.service";

export async function getAssessmentTools(req: Request, res: Response){
    try{    
        const [assessmentTools, status] = await assessmentToolService.getAssessmentTools(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(assessmentTools);
    
    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getAssessmentTool(req: Request, res: Response){
    try{    
        const [assessmentTool, status] = await assessmentToolService.getAssessmentTool(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getAssessmentToolsActive(req: Request, res: Response){
    try{
        const [assessmentTool, status] = await assessmentToolService.getAssessmentToolsActive(req.headers.authorization, "active");
        return res.status(status).json(assessmentTool);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function deactivateAssessmentTool(req: Request, res: Response) {
    try {
        const [assessmentTool, status] = await assessmentToolService.deactivateAssessmentTool(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}
export async function activateAssessmentTool(req: Request, res: Response) {
    try {
        const [assessmentTool, status] = await assessmentToolService.activateAssessmentTool(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function deleteAssessmentTool(req: Request, res: Response){
    try{
        const [assessmentTool, status] = await assessmentToolService.deleteAssessmentTool(req.headers.authorization, req.params.id);
        return res.status(status).json(assessmentTool);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function createAssessmentTool(req: Request, res: Response) {
    try {
        const [assessmentTool, status] = await assessmentToolService.createAssessmentTool(req.headers.authorization, req.body);
        return res.status(status).json(assessmentTool);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function editAssessmentTool(req: Request, res: Response) {
    try {
        const [assessmentTool, status] = await assessmentToolService.editAssessmentTool(req.headers.authorization, req.body);
        return res.status(status).json(assessmentTool);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}
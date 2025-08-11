import * as assessmentToolService from "../../services/seb-server/assessment-tool.service";
import * as apiService from "../../services/seb-server/api.service";
import {Request, Response} from "express";

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

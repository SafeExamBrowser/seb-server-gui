import * as assessmentToolService from "../services/assessment-tool.service";
import * as apiService from "../services/api.service";
import {Request, Response} from "express";

export async function getAssessmentTools(req: Request, res: Response){
    try{    
            const [assessmentTool, status] = await assessmentToolService.getAssessmentTools(req.headers.authorization, req.query.isActive);
            return res.status(status).json(assessmentTool);
    
        }catch(error){
            apiService.handleGenericApiError(error, res);
        }
}
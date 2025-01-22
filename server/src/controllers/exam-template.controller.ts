import {Request, Response} from "express";
import {LOG} from "../logging/logger";
import * as examTemplateService from "../services/exam-template.service";
import * as apiService from "../services/api.service";


export async function getExamTemplates(req: Request, res: Response){
    try{
        const [examTemplates, status] = await examTemplateService.getExamTemplates(req.headers.authorization, req.query.optionalParamters);
        return res.status(status).json(examTemplates);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
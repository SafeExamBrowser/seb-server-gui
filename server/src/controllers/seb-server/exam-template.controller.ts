import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as examTemplateService from "../../services/seb-server/exam-template.service";
import * as apiService from "../../services/seb-server/api.service";
import * as constants from "../../utils/constants";

export async function getExamTemplate(req: Request, res: Response){
    try{
        const [examTemplate, status] = await examTemplateService.getExamTemplate(req.headers.authorization, req.params.id);
        return res.status(status).json(examTemplate);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

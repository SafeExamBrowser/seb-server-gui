import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as examService from "../../services/seb-server/exam.service";
import * as apiService from "../../services/seb-server/api.service";


export async function getExamConfigurationMap(req: Request, res: Response){
    try{
        const [examConfigurationMap, status] = await examService.getExamConfigurationMap(req.headers.authorization, req.params.id, req.query.optionalParameters);
        return res.status(status).json(examConfigurationMap);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

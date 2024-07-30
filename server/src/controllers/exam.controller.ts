import {Request, Response} from "express";
import {LOG} from "../logging/logger";
import * as examService from "../services/exam.service";
import * as apiService from "../services/api.service";


export async function getExams(req: Request, res: Response){
    try{
        const exams: object = await examService.getExams(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getExamConfigurationMap(req: Request, res: Response){
    try{
        const examConfigurationMap: object = await examService.getExamConfigurationMap(req.headers.authorization, req.params.id, req.query.optionalParamters);

        return res.status(200).json(examConfigurationMap);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
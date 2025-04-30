import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as indicatorService from "../../services/seb-server/indicator.service";
import * as apiService from "../../services/seb-server/api.service";


export async function getIndicators(req: Request, res: Response){
    try{
        const [indicators, status] = await indicatorService.getIndicators(req.headers.authorization, req.query.examId);
        return res.status(status).json(indicators);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
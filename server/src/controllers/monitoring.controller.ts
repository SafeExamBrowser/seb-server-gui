import * as monitoringService from "../services/monitoring.service";
import * as apiService from "../services/api.service";
import {Request, Response} from "express";

export async function applyTestRun(req: Request, res: Response){
    try{    
        const [exam, status] = await monitoringService.applyTestRun(req.headers.authorization, req.params.id);
        return res.status(status).json(exam);
    
    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
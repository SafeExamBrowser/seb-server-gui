import * as screenProctoringService from "../services/screen-proctoring.service";
import * as apiService from "../services/api.service";
import {Request, Response} from "express";


export async function saveScreenProctoringSettings(req: Request, res: Response){
    try{
        const [exam, status] = await screenProctoringService.saveScreenProctoringSettings(req.headers.authorization, req.params.id, req.body);
        return res.status(status).json(exam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

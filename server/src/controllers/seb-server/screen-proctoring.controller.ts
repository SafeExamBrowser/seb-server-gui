import * as screenProctoringService from "../../services/seb-server/screen-proctoring.service";
import * as apiService from "../../services/seb-server/api.service";
import {Request, Response} from "express";


export async function saveScreenProctoringSettings(req: Request, res: Response){
    try{
        const [exam, status] = await screenProctoringService.saveScreenProctoringSettings(
            req.headers.authorization, 
            req.params.id, 
            req.body
        
        );
        return res.status(status).json(exam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function applyScreenProctoringGroups(req: Request, res: Response){
    try{
        const [exam, status] = await screenProctoringService.applyScreenProctoringGroups(req.headers.authorization, req.params.id, req.query.spsSEBGroupsSelection);
        return res.status(status).json(exam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function activateScreenProctoring(req: Request, res: Response){
    try{

        console.log(req.query)
        console.log(req.params)

        const [exam, status] = await screenProctoringService.activateScreenProctoring(req.headers.authorization, req.params.id, req.query.enableScreenProctoring);
        return res.status(status).json(exam);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
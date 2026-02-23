import * as screenProctoringService from "../../services/seb-server/screen-proctoring.service";
import * as apiService from "../../services/seb-server/api.service";
import {Request, Response} from "express";

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
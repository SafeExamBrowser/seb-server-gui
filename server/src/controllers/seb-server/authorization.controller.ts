import {Request, Response} from 'express';
import * as apiService from "../../services/seb-server/api.service";
import * as authorizationService from '../../services/seb-server/authorization.service';

export async function logLogin(req: Request, res: Response){
    try{
        //does not return data
        await authorizationService.logLogin(req.headers.authorization);

        return res.status(200).json();

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function logLogout(req: Request, res: Response){
    try{
        //does not return data
        await authorizationService.logLogout(req.headers.authorization);

        return res.status(200).json();

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
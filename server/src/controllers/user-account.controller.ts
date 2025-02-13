import {Request, Response} from "express";
import {LOG} from "../logging/logger";
import * as userAccountService from "../services/user-account.service";
import * as apiService from "../services/api.service";


export async function getUserAccount(req: Request, res: Response){
    try{
        const [userAccount, status] = await userAccountService.getUserAccount(req.headers.authorization, req.params.id);
        return res.status(status).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getUserAccountNames(req: Request, res: Response){
    try{
        const [userAccountNames, status] = await userAccountService.getUserAccountNames(req.headers.authorization, req.query.optionalParamters);
        return res.status(status).json(userAccountNames);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
import {Request, Response} from "express";
import * as userAccountService from "../../services/seb-server/user-account.service";
import * as apiService from "../../services/seb-server/api.service";


export async function getUserAccountFeatures(req: Request, res: Response){
    try{
        const [response, status] = await userAccountService.getUserAccountFeatures(req.headers.authorization);
        return res.status(status).json(response);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getUserAccountNames(req: Request, res: Response){
    try{
        const [userAccountNames, status] = await userAccountService.getUserAccountNames(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(userAccountNames);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function registerUserAccount(req: Request, res: Response) {
    try {
        const [userAccount, status] = await userAccountService.registerUserAccount(req.body);
        return res.status(status).json(userAccount);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function editUserAccount(req: Request, res: Response) {
    try {
        const [userAccount, status] = await userAccountService.editUserAccount(req.headers.authorization, req.body);
        return res.status(status).json(userAccount);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

import {Request, Response} from "express";
import * as userAccountService from "../../services/screen-proctoring/sp-user-account.service";
import * as apiService from "../../services/screen-proctoring/sp-api.service";


export async function getPersonalUserAccount(req: Request, res: Response){
    try{
        const [personalUserAccount, status] = await userAccountService.getPersonalUserAccount(req.headers.authorization)
        return res.status(status).json(personalUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getUserAccountById(req: Request, res: Response){
    try{
        const [userAccount, status] = await userAccountService.getUserAccountById(req.headers.authorization, req.params.accountId)
        return res.status(status).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function registerUserAccount(req: Request, res: Response){
    try{
        const [newUserAccount, status] = await userAccountService.registerUserAccount(req.body)
        return res.status(status).json(newUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }

}

export async function changePassword(req: Request, res: Response){
    try{
        const [newUserAccount, status] = await userAccountService.changePassword(req.headers.authorization, req.body)
        return res.status(status).json(newUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getUserAccounts(req: Request, res: Response){
    try{
        const [userAccounts, status] = await userAccountService.getUserAccounts(req.headers.authorization, req.query.optionalParamters)
        return res.status(status).json(userAccounts);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function activateUserAccount(req: Request, res: Response){
    try{
        const [userAccount, status] = await userAccountService.activateUserAccount(req.headers.authorization, req.params.accountId)
        return res.status(status).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function deactivateUserAccount(req: Request, res: Response){
    try{
        const [userAccount, status] = await userAccountService.deactivateUserAccount(req.headers.authorization, req.params.accountId)
        return res.status(status).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
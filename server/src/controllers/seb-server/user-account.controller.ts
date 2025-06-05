import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as userAccountService from "../../services/seb-server/user-account.service";
import * as apiService from "../../services/seb-server/api.service";


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


export async function createUserAccount(req: Request, res: Response) {
    try {
        const [userAccount, status] = await userAccountService.createUserAccount(req.headers.authorization, req.body);
        return res.status(status).json(userAccount);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function getUserAccounts(req: Request, res: Response) {
    try {

        const [userAccount, status] = await userAccountService.getUserAccounts(req.headers.authorization, req.query.optionalParameters);

        console.log(req.body);
        return res.status(status).json(userAccount);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}


export async function getSupervisorAccountNames(req: Request, res: Response){
    try{
        const [userAccountNames, status] = await userAccountService.getSupervisorAccountNames(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(userAccountNames);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


import {Request, Response} from "express";
import * as userAccountService from "../../services/seb-server/user-account.service";
import * as apiService from "../../services/seb-server/api.service";


export async function getUserAccount(req: Request, res: Response){
    try{
        const [userAccount, status] = await userAccountService.getUserAccount(req.headers.authorization, req.params.id);
        return res.status(status).json(userAccount);
    }catch(error){
        if (req.query.skip_error && req.query.skip_error.toString().includes(error.status.toString())) {
            res.status(206).send(null)
        } else {
            apiService.handleGenericApiError(error, res);
        }
    }
}

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

export async function deleteUserAccount(req: Request, res: Response){
    try{
        const [userAccount, status] = await userAccountService.deleteUserAccount(req.headers.authorization, req.params.id);
        return res.status(status).json(userAccount);

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

export async function deactivateAccount(req: Request, res: Response) {
    try {
        const [userAccount, status] = await userAccountService.deactivateAccount(req.headers.authorization, req.params.id);
        return res.status(status).json(userAccount);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}
export async function activateAccount(req: Request, res: Response) {
    try {
        const [userAccount, status] = await userAccountService.activateAccount(req.headers.authorization, req.params.id);
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

export async function editUserAccount(req: Request, res: Response) {
    try {
        const [userAccount, status] = await userAccountService.editUserAccount(req.headers.authorization, req.body);
        return res.status(status).json(userAccount);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}


export async function changePassword(req: Request, res: Response) {
    try {
        const [editPasswordParams, status] = await userAccountService.changePassword(req.headers.authorization, req.body);
        return res.status(status).json(editPasswordParams);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}


export async function getUserAccounts(req: Request, res: Response) {
    try {

        const [userAccount, status] = await userAccountService.getUserAccounts(req.headers.authorization, req.query.optionalParameters);
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


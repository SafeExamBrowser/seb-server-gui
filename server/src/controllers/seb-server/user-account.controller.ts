import {Request, Response} from "express";
import * as userAccountService from "../../services/seb-server/user-account.service";
import * as apiService from "../../services/seb-server/api.service";


export async function registerUserAccount(req: Request, res: Response) {
    try {
        const [userAccount, status] = await userAccountService.registerUserAccount(req.body);
        return res.status(status).json(userAccount);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

import { Request, Response, NextFunction } from 'express';
import * as ENV from "../config/envConfig";
import * as userAccountService from "../services/screen-proctoring/sp-user-account.service";

//checks if the user is allowed to controll the user account
//if sebIntegratedMode = true --> allowed
//if sebIntegratedMode = false & role = admin --> allowed
//otherweise --> not allowed
export async function isUserAccountOperationAllowed(req: Request, res: Response, next: NextFunction) {
    try {
        if(ENV.SEB_SERVER_INTEGRATED_MODE == "false"){
            next();
            return;
        }

        const [userAccount, status] = await userAccountService.getPersonalUserAccount(req.headers.authorization);
        if(userAccount.roles.includes("ADMIN")){
            next();
            return;
        }

        res.status(401).json({ message: 'Unauthorized' });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
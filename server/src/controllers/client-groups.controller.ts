import {Request, Response} from "express";
import {LOG} from "../logging/logger";
import * as clientGroupsService from "../services/client-groups.service";
import * as apiService from "../services/api.service";

export async function getClientGroups(req: Request, res: Response){
    try{
        const [clientGroups, status] = await clientGroupsService.getClientGroups(req.headers.authorization, req.query.examId);
        return res.status(status).json(clientGroups);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
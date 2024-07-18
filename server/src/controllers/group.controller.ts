import {Request, Response} from 'express';
import {LOG} from '../logging/logger';
import * as groupService from '../services/group.service';
import * as apiService from "../services/api.service";

export async function getGroups(req: Request, res: Response){
    try{
        const groups: object = await groupService.getGroups(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(groups);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function getGroupByUuid(req: Request, res: Response){
    try{
        const group: object = await groupService.getGroupByUuid(req.headers.authorization, req.params.uuid, req.query.optionalParamters);

        return res.status(200).json(group);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
import {Request, Response} from 'express';
import {LOG} from '../../logging/logger';
import * as groupService from '../../services/screen-proctoring/sp-group.service';
import * as apiService from "../../services/screen-proctoring/sp-api.service";

export async function getGroups(req: Request, res: Response){
    try{
        const [groups, status] = await groupService.getGroups(req.headers.authorization, req.query.optionalParamters);
        return res.status(status).json(groups);

    }catch(error){
        console.log("it got here into the controller catch")
        apiService.handleGenericApiError(error, res);
    }
}


export async function getGroupByUuid(req: Request, res: Response){
    try{
        const [group, status] = await groupService.getGroupByUuid(req.headers.authorization, req.params.uuid, req.query.optionalParamters);
        return res.status(status).json(group);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
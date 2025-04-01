import {Request, Response} from "express";
import {LOG} from "../logging/logger";
import * as clientGroupsService from "../services/client-groups.service";
import * as apiService from "../services/api.service";


export async function createClientGroup(req: Request, res: Response){
    try{
        const [clientGroup, status] = await clientGroupsService.createClientGroup(req.headers.authorization, req.body);
        return res.status(status).json(clientGroup);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function updateClientGroup(req: Request, res: Response){
    try{
        const [clientGroup, status] = await clientGroupsService.updateClientGroup(req.headers.authorization, req.body);
        return res.status(status).json(clientGroup);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function deleteClientGroup(req: Request, res: Response){
    try{
        const [clientGroup, status] = await clientGroupsService.deleteClientGroup(req.headers.authorization, req.params.id);
        return res.status(status).json(clientGroup);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getClientGroup(req: Request, res: Response){
    try{
        const [clientGroup, status] = await clientGroupsService.getClientGroup(req.headers.authorization, req.params.id);
        return res.status(status).json(clientGroup);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getClientGroups(req: Request, res: Response){
    try{
        const [clientGroups, status] = await clientGroupsService.getClientGroups(req.headers.authorization, req.query.examId);
        return res.status(status).json(clientGroups);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
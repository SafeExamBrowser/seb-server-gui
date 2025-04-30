import {Request, Response} from 'express';
import * as apiService from "../../services/screen-proctoring/sp-api.service";
import * as searchService from '../../services/screen-proctoring/sp-search.service';

export async function searchSessionsDay(req: Request, res: Response){
    try{
        const [sessions, status] = await searchService.searchSessionsDay(req.headers.authorization, req.query.optionalParamters);
        return res.status(status).json(sessions);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function searchSessions(req: Request, res: Response){
    try{
        const [sessions, status] = await searchService.searchSessions(req.headers.authorization, req.query.optionalParamters);
        return res.status(status).json(sessions);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function searchScreenshots(req: Request, res: Response){
    try{
        const [screenshots, status] = await searchService.searchScreenshots(req.headers.authorization, req.query.optionalParamters);
        return res.status(status).json(screenshots);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function searchTimeline(req: Request, res: Response){
    try{
        const [timeline, status] = await searchService.searchTimeline(req.headers.authorization, req.params.sessionId, req.query.optionalParamters);
        return res.status(status).json(timeline);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function deleteSessions(req: Request, res: Response){
    try{
        const [response, status] = await searchService.deleteSessions(req.headers.authorization, req.query.modelIds);
        return res.status(status).json(response);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
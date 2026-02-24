import {Request, Response} from 'express';
import * as apiService from "../../services/screen-proctoring/sp-api.service";
import * as searchService from '../../services/screen-proctoring/sp-search.service';

export async function deleteSessions(req: Request, res: Response){
    try{
        const [response, status] = await searchService.deleteSessions(req.headers.authorization, req.query.modelIds);
        return res.status(status).json(response);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
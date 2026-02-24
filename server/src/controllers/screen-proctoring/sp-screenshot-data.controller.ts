import {Request, Response} from 'express';
import * as apiService from "../../services/screen-proctoring/sp-api.service";
import * as screenshotDataService from '../../services/screen-proctoring/sp-screenshot-data.service';

export async function getScreenshotTimestamps(req: Request, res: Response){
    try{
        const [screenshotTimestamps, status] = await screenshotDataService.getScreenshotTimestamps(req.headers.authorization, req.params.sessionId, req.params.timestamp, req.params.direction);
        return res.status(status).json(screenshotTimestamps);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
import {Request, Response} from "express";
import * as apiService from "../../services/screen-proctoring/sp-api.service";
import * as applicationSearchService from "../../services/screen-proctoring/sp-application-search.service";

export async function getUserListForApplicationSearch(req: Request, res: Response){
    try{
        const [userList, status] = await applicationSearchService.getUserListForApplicationSearch(req.headers.authorization, {
            "groupIds": req.query.groupIds,
            "screenProctoringMetadataApplication": req.query.screenProctoringMetadataApplication,
            "screenProctoringMetadataWindowTitle": req.query.screenProctoringMetadataWindowTitle
        });

        return res.status(status).json(userList);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getTimestampListForApplicationSearch(req: Request, res: Response){
    try{
        const [timestampList, status] = await applicationSearchService.getTimestampListForApplicationSearch(req.headers.authorization, {
            "sessionUUID": req.query.sessionUUID,
            "screenProctoringMetadataApplication": req.query.screenProctoringMetadataApplication,
            "screenProctoringMetadataWindowTitle": req.query.screenProctoringMetadataWindowTitle
        });

        return res.status(status).json(timestampList);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
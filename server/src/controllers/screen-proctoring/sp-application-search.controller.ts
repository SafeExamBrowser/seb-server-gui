import {Request, Response} from "express";
import * as apiService from "../../services/screen-proctoring/sp-api.service";
import * as applicationSearchService from "../../services/screen-proctoring/sp-application-search.service";

export async function getGroupIdsForExam(req: Request, res: Response){
    try{
        const [ids, status] = await applicationSearchService.getGroupIdsForExam(req.headers.authorization, req.params.examId);
        return res.status(status).json(ids);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getDistinctMetadataAppForExam(req: Request, res: Response){
    try{
        const [metadataApps, status] = await applicationSearchService.getDistinctMetadataAppForExam(req.headers.authorization, req.query.groupIds);
        return res.status(status).json(metadataApps);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getDistinctMetadataWindowForExam(req: Request, res: Response){
    try{
        const [metadataWindows, status] = await applicationSearchService.getDistinctMetadataWindowForExam(req.headers.authorization, {
            "groupIds": req.query.groupIds,
            "screenProctoringMetadataApplication": req.query.screenProctoringMetadataApplication,
        });

        return res.status(status).json(metadataWindows);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

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
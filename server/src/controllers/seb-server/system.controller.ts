import {Request, Response} from "express";
import * as apiService from "../../services/seb-server/api.service";
import * as constants from "../../utils/constants";

export async function getSystemFeatures(req: Request, res: Response){
    try{

        const url: string =  constants.QUIZ_ROUTE;
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeadersWithoutAuth()});
        return res.status(status).json(data);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

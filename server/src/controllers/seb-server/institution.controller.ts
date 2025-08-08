import {Request, Response} from "express";
import * as institutionService from "../../services/seb-server/institution.service";
import * as apiService from "../../services/seb-server/api.service";


export async function getInstitutions(req: Request, res: Response){
    try{
        const [institutions, status] = await institutionService.getInstitutions();
        return res.status(status).json(institutions);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function getInstitutionLogo(req: Request, res: Response){
    try{
        const [logo, status] = await institutionService.getInstitutionLogo(req.params.suffix);
        return res.status(status).json(logo);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
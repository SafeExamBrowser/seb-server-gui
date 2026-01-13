import * as certificateService from "../../services/seb-server/certificate.service";
import * as apiService from "../../services/seb-server/api.service";
import {Request, Response} from "express";


export async function deleteCertificate(req: Request, res: Response){
    try{
        const [certificate, status] = await certificateService.deleteCertificate(req.headers.authorization, req.params.alias);
        return res.status(status).json(certificate);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function createCertificate(req: Request, res: Response) {
    try {
        const [certificate, status] = await certificateService.createCertificate(
            req.headers.authorization as string,
            req.body
        );
        return res.status(status).json(certificate);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

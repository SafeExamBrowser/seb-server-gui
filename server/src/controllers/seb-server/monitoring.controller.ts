import * as monitoringService from "../../services/seb-server/monitoring.service";
import * as apiService from "../../services/seb-server/api.service";
import {Request, Response} from "express";

export async function confirmNotification(req: Request, res: Response){
    try{
        const [status, data] = await monitoringService.confirmNotification(
            req.headers.authorization, req.params.id, req.params.notificationId, req.params.connectionToken); 

            return res.status(status).json(data ?? {});

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function disableConnections(req: Request, res: Response) {
    try {
        const [status, data] = await monitoringService.disableConnections(
            req.headers.authorization as string,
            req.params.id,
            req.body
        );

        return res.status(status).json(data ?? {});
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

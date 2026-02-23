import * as monitoringService from "../../services/seb-server/monitoring.service";
import * as apiService from "../../services/seb-server/api.service";
import {Request, Response} from "express";

export async function applyTestRun(req: Request, res: Response){
    try{    
        const [exam, status] = await monitoringService.applyTestRun(req.headers.authorization, req.params.id);
        return res.status(status).json(exam);
    
    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getSingleConnection(req: Request, res: Response){
    try{    
        const [connection, status] = await monitoringService.getSingleConnection(req.headers.authorization, req.params.id, req.params.connectionToken);
        return res.status(status).json(connection);
    
    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getStaticClientData(req: Request, res: Response){
    try{    
        const [staticClientData, status] = await monitoringService.getStaticClientData(req.headers.authorization, req.params.id, req.body);
        return res.status(status).json(staticClientData);
    
    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function registerInstruction(req: Request, res: Response) {
    try {
        const [status, data] = await monitoringService.registerInstruction(
            req.headers.authorization,
            req.params.id,
            req.body
        );
        return res.status(status).json(data ?? {});
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function quitAll(req: Request, res: Response) {
    try {
        const [status, data] = await monitoringService.quitAll(
            req.headers.authorization,
            req.params.id
        );
        return res.status(status).json(data ?? {});
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}

export async function getPendingNotifications(req: Request, res: Response){
    try{

        const [notifications, status] = await monitoringService.getPendingNotifications(req.headers.authorization, req.params.id, req.params.connectionToken);
        return res.status(status).json(notifications);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

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

export async function getClientEventLogs(req: Request, res: Response){
    try{
        const [logs, status] = await monitoringService.getClientEventLogs(req.headers.authorization, req.params.id,  req.query.optionalParameters);
        return res.status(status).json(logs);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
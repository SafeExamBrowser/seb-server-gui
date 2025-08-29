import {Request, Response} from "express";
import * as clientConnectionService from "../../services/seb-server/client-connection.service";
import * as apiService from "../../services/seb-server/api.service";

export async function getClientConnectionList(req: Request, res: Response) {
    try {
        const modelIds = (req.query.modelIds ?? "").toString();
        const options = { modelIds };

        const [clientConnectionList, status] =
            await clientConnectionService.getClientConnectionList(
                req.headers.authorization as string,
                options
            );

        return res.status(status).json(clientConnectionList);
    } catch (error) {
        apiService.handleGenericApiError(error, res);
    }
}
import * as apiService from "../../services/seb-server/api.service";
import { Request, Response } from "express";

export const genericGetAction = async (req: Request, res: Response) => {
  try {
    const { data, status } = await apiService.api.get(req.url, {
      headers: apiService.getHeaders(req.headers.authorization),
      params: req.query,
    });

    return res.status(status).json(data);
  } catch (error) {
    apiService.handleGenericApiError(error, res);
  }
};

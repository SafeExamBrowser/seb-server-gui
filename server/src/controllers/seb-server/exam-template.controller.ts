import {Request, Response} from "express";
import {LOG} from "../../logging/logger";
import * as examTemplateService from "../../services/seb-server/exam-template.service";
import * as apiService from "../../services/seb-server/api.service";
import * as constants from "../../utils/constants";

export async function getExamTemplate(req: Request, res: Response){
    try{
        const [examTemplate, status] = await examTemplateService.getExamTemplate(req.headers.authorization, req.params.id);
        return res.status(status).json(examTemplate);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function getExamTemplates(req: Request, res: Response){
    try{
        console.log(req.body);

        const [examTemplates, status] = await examTemplateService.getExamTemplates(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(examTemplates);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getExamTemplateSp(req: Request, res: Response){
    try{
        const [examTemplateSp, status] = await examTemplateService.getExamTemplateSp(req.headers.authorization, req.params.id);
        return res.status(status).json(examTemplateSp);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function createExamTemplate(req: Request, res: Response) {
    try {
      const { data, status } = await apiService.api.post(
        constants.EXAM_TEMPLATE_ROUTE + "/create",
        req.body,
        {
          headers: apiService.getApplicationJsonHeaders(
            req.headers.authorization
          ),
        }
      );

      return res.status(status).json(data);
    } catch (error) {
      apiService.handleGenericApiError(error, res);
    }
  }
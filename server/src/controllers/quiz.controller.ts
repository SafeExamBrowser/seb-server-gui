import {Request, Response} from "express";
import {LOG} from "../logging/logger";
import * as quizService from "../services/quiz.service";
import * as apiService from "../services/api.service";

export async function getQuizzes(req: Request, res: Response){
    try{
        const quizzes: object = await quizService.getQuizzes(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(quizzes);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


// export async function getGroupByUuid(req: Request, res: Response){
//     try{
//         const group: object = await quizService.getGroupByUuid(req.headers.authorization, req.params.uuid, req.query.optionalParamters);

//         return res.status(200).json(group);

//     }catch(error){
//         apiService.handleGenericApiError(error, res);
//     }
// }
import {Request, Response} from "express";
import * as quizService from "../../services/seb-server/quiz.service";
import * as apiService from "../../services/seb-server/api.service";

export async function getQuizzes(req: Request, res: Response){
    try{
        const [quizzes, status] = await quizService.getQuizzes(req.headers.authorization, req.query.optionalParameters);
        return res.status(status).json(quizzes);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


// export async function getGroupByUuid(req: Request, res: Response){
//     try{
//         const group: object = await quizService.getGroupByUuid(req.headers.authorization, req.params.uuid, req.query.optionalParameters);

//         return res.status(200).json(group);

//     }catch(error){
//         apiService.handleGenericApiError(error, res);
//     }
// }
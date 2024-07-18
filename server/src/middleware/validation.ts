import {Request, Response, NextFunction} from 'express';
import {Result, ValidationError, body, validationResult} from 'express-validator';
import {LOG} from '../logging/logger';

export const validateAuthorize = [

    body("username").notEmpty().withMessage("username is required"), 
    body("password").notEmpty().withMessage("password is required"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()){

          LOG.error("validation errors: ")
          LOG.error(errors.array())

          return res.status(422).json({errors: errors.array()});
        }
        next();
      },
]; 
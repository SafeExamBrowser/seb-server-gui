import express, {Router} from 'express';
import * as authorizationController from '../controllers/screen-proctoring/sp-authorization.controller';
import * as validation from '../middleware/validation';

const router: Router = express.Router();

router.post("/sp-authorize", validation.validateAuthorize, authorizationController.authorize);
router.post("/sp-refresh", authorizationController.refresh);

router.post("/sp-jwttoken/verify", authorizationController.verifyJwt);

router.post("/sp-useraccount/logLogin", authorizationController.logLogin);
router.post("/sp-useraccount/logLogout", authorizationController.logLogout)

export default router;
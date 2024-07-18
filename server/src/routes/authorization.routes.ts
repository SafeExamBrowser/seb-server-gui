import express, {Router} from 'express';
import * as authorizationController from '../controllers/authorization.controller';
import * as validation from '../middleware/validation';

const router: Router = express.Router();

router.post("/authorize", validation.validateAuthorize, authorizationController.authorize);
router.post("/refresh", authorizationController.refresh);

router.post("/jwttoken/verify", authorizationController.verifyJwt);

router.post("/useraccount/logLogin", authorizationController.logLogin);
router.post("/useraccount/logLogout", authorizationController.logLogout)

export default router;
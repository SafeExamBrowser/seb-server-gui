import express, {Router} from 'express';
import * as authorizationController from '../controllers/seb-server/authorization.controller';

const router: Router = express.Router();

router.post("/useraccount/logLogin", authorizationController.logLogin);
router.post("/useraccount/logLogout", authorizationController.logLogout)

export default router;
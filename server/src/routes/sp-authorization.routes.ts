import express, {Router} from 'express';
import * as authorizationController from '../controllers/screen-proctoring/sp-authorization.controller';

const router: Router = express.Router();

router.post("/sp-useraccount/logLogin", authorizationController.logLogin);
router.post("/sp-useraccount/logLogout", authorizationController.logLogout)

export default router;
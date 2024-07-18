import express, {Router} from 'express';
import * as groupController from '../controllers/group.controller';

const router: Router = express.Router();

router.get("/group", groupController.getGroups);


export default router;
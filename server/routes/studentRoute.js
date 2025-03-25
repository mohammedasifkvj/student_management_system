import express from 'express';
import { verifyUserToken } from '../middlewares/verifyToken.js';

import { signin,
    fetchTasks,
    updateTaskStatus,
    signout } from '../controllers/userController.js';

const router = express.Router();

router.post('/signin', signin);
router.get('/getTasks/:studentId',verifyUserToken, fetchTasks);
router.patch('/updateTask/:taskId',verifyUserToken, updateTaskStatus);
router.get('/signout', signout);

export default router;
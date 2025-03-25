import express from 'express';

import { verifyAdminAndTokenAndToken } from '../middlewares/verifyToken.js'
import {
  adminSignup,
  adminSignin,
  fetchStudents,
  createStudent,
  fetchTask,
  assignTask,
  signout
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/signin',adminSignin)
router.get('/studentsList',verifyAdminAndToken, fetchStudents);
router.post('/createStudent',verifyAdminAndToken, createStudent);
router.post('/assignTask/:id', verifyAdminAndToken, assignTask);
router.get('/showTask/:id',verifyAdminAndToken, fetchTask);
router.get('/signout', signout);

export default router;
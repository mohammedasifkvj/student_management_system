import express from 'express';

import { verifyAdmin } from '../middlewares/verifyToken.js';
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
router.get('/studentsList',verifyAdmin, fetchStudents);
router.post('/createStudent',verifyAdmin, createStudent);
router.post('/assignTask/:id', verifyAdmin, assignTask);
router.get('/showTask/:id',verifyAdmin, fetchTask);
router.get('/signout', signout);

export default router;
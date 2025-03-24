import express from 'express';

import { verifyAdmin } from '../middlewares/verifyToken.js';
import {
  adminSignin,
  fetchStudents,
  createStudent,
  fetchData,
  assignTask,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/signin',adminSignin)
router.get('/list',verifyAdmin, fetchStudents);
router.post('/createStudent',verifyAdmin, createStudent);
router.get('/getUser/:id',verifyAdmin, fetchData);
router.post('/assignTask/:id', verifyAdmin, assignTask);
router.delete('/deleteUser/:id', verifyAdmin, deleteUser);

export default router;
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

import User from '../models/studentModel.js';
import Task from '../models/taskModel.js'
import errorHandler from '../middlewares/errorHandler.js';

export const adminSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    const isAdmin = await User.findOne({ email,isAdmin:true });
    if (!isAdmin) return next(errorHandler(404, 'You are not an Admin'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));
  
    const token = jwt.sign({ id: validUser._id ,role:'admin'}, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

//Fetch Users Data for table
export const fetchStudents = async (req, res) => {
  try {
      const users = await User.find({isAdmin:false});
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

//create a new Student
export const createStudent = async (req, res, next) => {
  const { username, email,department, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
   const newStudent = new User({ username, email,department, password: hashedPassword });
    await newStudent.save();
    res.status(201).json({ message: 'New Student created successfully' });
  } catch (error) {
    next(error);
  }
};

//Fetch Users Data for update
export const fetchData=async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// update user
export const assignTask = async (req, res, next) => {
    console.log("data",req.body);
    
    const id=req.params.id
    const { taskName, description } = req.body;
    try { 
     const task = new Task({ student:id ,taskName, description:description });
      await task.save();
      res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }
}
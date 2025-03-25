import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

import Admin from '../models/adminModel.js';
import User from '../models/studentModel.js';
import Task from '../models/taskModel.js'

// Admin Sign-Up
export const adminSignup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // console.log(req.body);
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newAdmin = new Admin({ username, email, password: hashedPassword });
  try {
      await newAdmin.save();
      res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
      next(error);
  }
};

export const adminSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validAdmin = await Admin.findOne({ email });
    if (!validAdmin) {
      return res.status(400).json({ success: false, message: ' Account not found' });
    }
    const isAdmin = await Admin.findOne({ email,isAdmin:true });
    if (!isAdmin){
      return res.status(403).json({ success: false, message:'You are not an Admin' });
    }

    const validPassword = bcryptjs.compareSync(password, validAdmin.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Wrong credentails' });
    }
  
    const token = jwt.sign({ id: validAdmin._id ,role:'admin'}, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validAdmin._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error);
  }
};

//create a new Student
export const createStudent = async (req, res) => {
  const { username, email,department, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
   const newStudent = new User({ username, email,department, password: hashedPassword });
    await newStudent.save();
    res.status(201).json({ message: 'New Student created successfully' });
  } catch (error) {
    console.log(error);
    
  }
};

//Fetch Students Data for table
export const fetchStudents = async (req, res) => {
  try {
      const users = await User.find();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

// Assign task
export const assignTask = async (req, res) => {
    console.log("data",req.body);
    
    const id=req.params.id
    const { taskName, description,dueTime } = req.body;
    try { 
     const task = new Task({ student:id ,taskName, description:description ,dueTime});
      await task.save();
      res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
   console.log(error);
  }
};

// Fetch Tasks Assigned for a Student
export const fetchTask = async (req, res) => {
  try {
    
    const tasks = await Task.find({ student: req.params.id });

    if (tasks && tasks.length > 0) {
      res.status(200).json({ success: true, tasks });
    } else {
      res.status(404).json({ success: false, message: 'No tasks found for the user' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Sign out
export const signout = (req, res) => {
  try {
      res.clearCookie('access_token').status(200).json({ message: 'Signout success!' });
  } catch (error) {
      console.log(error);
      
  }
};
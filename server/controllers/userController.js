import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import User from '../models/studentModel.js';
import Task from '../models/taskModel.js';

// Stdent login
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(400).json({ success: false, message: ' Student not found' });
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword){
            return res.status(400).json({ success: false, message: ' wrong credentials' });
        }

        const token = jwt.sign({ id: validUser._id, role: 'student' }, process.env.JWT_SECRET);
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

//fetch tasks
export const fetchTasks=async (req,res)=>{
    const {studentId}=req.params;
    // console.log("StId",studentId);
    try {
        const tasks = await Task.find({ student: studentId});
        if (tasks && tasks.length > 0) {
          res.status(200).json({ success: true, tasks });
        } else {
          res.status(404).json({ success: false, message: 'No tasks found you' });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
}

// task status change
export const updateTaskStatus = async (req, res) => {
  try {
    // console.log("params",req.params);
    const { taskId } = req.params;
    const { status } = req.body;

    // Validate that the new status is 'completed'
    if (status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Invalid status update. Only "completed" is allowed.' });
    }

    // Find the task by its ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Only allow update if the current status is 'pending'
    if (task.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Task status cannot be updated. It is either overdue or already completed.' });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error('Error updating task status:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};


export const signout = (req, res) => {
    try {
        res.clearCookie('access_token').status(200).json({ message: 'Signout success!' });
    } catch (error) {
        console.log(error);
    }
};
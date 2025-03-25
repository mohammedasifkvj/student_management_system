import cron from 'node-cron';
import Task from '../models/taskModel';

//task status 
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();

    //pending tasks to overdue
    const result = await Task.updateMany(
      { dueTime: { $lt: now }, status: 'pending' },
      { $set: { status: 'overdue' } }
    );

    console.log(`Cron Job: ${result.modifiedCount} tasks marked as overdue.`);
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});

export default cron;
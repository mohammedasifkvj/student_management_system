import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    taskName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    dueTime: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to check if the task is overdue
taskSchema.pre('save', function (next) {
  if (this.dueTime && new Date(this.dueTime) < new Date() && this.status === 'pending') {
    this.status = 'overdue';
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
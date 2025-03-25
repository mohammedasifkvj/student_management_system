import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
        type: String,
        required: false,
      },
    password: {
      type: String,
      required: true,
    },
    isStudent: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
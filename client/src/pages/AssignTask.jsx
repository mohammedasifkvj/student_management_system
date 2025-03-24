import { useNavigate,useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  assignTaskStart,
  assignTaskSuccess,
  assignTaskFailure,
} from '../redux/admin/adminSlice';

export default function AssignTask() {
  const { id } = useParams(); // Extract the user ID from the URL
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ taskName: '', description:'', dueTime: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const [loadingg,setLoading] = useState(false);
  
  const navigate = useNavigate();

//   // Fetch the specific user's data on component mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(`/api/admin/getUser/${id}`);
//         const userData = await response.json();
//         setFormData(userData); // Set the user data in the form
//       } catch (err) {
//         console.error('Error fetching user:', err);
//       }
//     };

//     fetchUser();
//   }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(assignTaskStart());
      const response = await fetch(`/api/admin/assignTask/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (data.success === false) {
        alert(data.message || 'Something went wrong.');
        return;
      }
      
      dispatch(assignTaskSuccess(data));
      navigate('/list');
    } catch (err) {
      dispatch(assignTaskFailure(err.message));
    }
  };

  const validate = (name, value) => {
    switch (name) {
      case 'taskName':
        if (value.trim().length < 4) {
          return 'Task name must be at least 4 characters long and cannot be only spaces.';
        }
        return '';
      case 'description':
            if (value.trim().length < 4) {
              return 'Task name must be at least 4 characters long and cannot be only spaces.';
            }
            return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    const errorMessage = validate(id, value);
    setErrors({ ...errors, [id]: errorMessage });
  };

  const isFormValid = () => {
    // return (
    //   Object.values(errors).every((err) => err === '') &&
    //   Object.values(formData).every((value) => value.trim() !== '')
    // );
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Assign Task</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Task name'
          autoComplete="off"
          id='taskName'
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName}</p>}
        <input
          type='text'
          placeholder='Task name'
          autoComplete="off"
          id='description'
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        

        <button
          //disabled={loading || !isFormValid()}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      {error && <p className='text-red-700 mt-5'>Error: {error}</p>}
    </div>
  );
}
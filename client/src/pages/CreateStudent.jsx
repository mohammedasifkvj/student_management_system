import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CreateUser() {

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ username: '', email: '',department:'', password: '' });
  const [errors, setErrors] = useState({ username: '', email: '',department:'', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (name, value) => {
    switch (name) {
      case 'username':
        if (value.trim().length < 4) {
          return 'Username must be at least 4 characters long and cannot be only spaces.';
        }
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address.';
        }
        return '';
      case 'department':
          if (value.trim().length < 4) {
            return 'Department must be at least 3 characters long and cannot be only spaces.';
          }
          return '';
      case 'password':
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(value)) {
          return 'Password must be at least 6 characters long and include both letters and numbers.';
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
    return (
      Object.values(errors).every((err) => err === '') &&
      Object.values(formData).every((value) => value.trim() !== '')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/admin/createStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        alert(data.message || 'Something went wrong.');
        return;
      }
      navigate('/list');
    } catch (error) {
      setLoading(false);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Student</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          id='username'
          placeholder='Enter name of the Student'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        <input
          type='email'
          id='email'
          placeholder='Enter Email'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <input
          type='text'
          id='department'
          required="true"
          placeholder='Depertment'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          disabled={loading || !isFormValid()}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Create'}
        </button>
      </form>
      <p className='text-red-700 mt-5'>{error ? error && 'Something went wrong!' : ""}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'Student Created successfully!'}
      </p>
    </div>
  );
}
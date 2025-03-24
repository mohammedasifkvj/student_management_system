import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice.js';

 function Profile() {

  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({ password: '' });
  const [errors, setErrors] = useState({ password: '' });
  const [loading, setLoading] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const validate = (name, value) => {
    switch (name) {
      case 'password':
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
          return 'Password must be least 8 characters long and include letter,numbers and special charecter.';
        }
        return '';
      default:
        return '';
    }
  };


  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, error } = useSelector((state) => state.user);
  
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
      dispatch(updateUserStart());
      setLoading(true);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      setLoading(false);
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };

  // Show delete popup
  const confirmDelete = () => {
    setSelectedUser();
    setShowDeletePopup(true);
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 text-center mt-5'>
        {updateSuccess && 'Password updated successfully!'}
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          defaultValue={currentUser.username}
          className='bg-slate-100 rounded-lg p-3'
          disabled="true"
        />
        <input
          defaultValue={currentUser.email}
          className='bg-slate-100 rounded-lg p-3'
          disabled="true"
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          required
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          disabled={loading || !isFormValid()}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update Password'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={() => confirmDelete()}
          className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">Delete Account</h2>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to delete your account ?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAccount(selectedUser)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default Profile;
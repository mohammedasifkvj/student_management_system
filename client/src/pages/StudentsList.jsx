import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  getUser,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/admin/adminSlice';

export default function StudentsList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);

  const [showTaskPopup, setshowTaskPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/list');
        dispatch(getUser(response.data)); // Dispatch the action to store users
        console.log(response.data);
        
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  // Delete user
  const handleShowTask = async (userId) => {
    try {
      dispatch(deleteUserStart());
      await axios.delete(`/api/admin/deleteUser/${userId}`);
      dispatch(deleteUserSuccess(userId));
      setshowTaskPopup(false);
    } catch (error) {
      dispatch(deleteUserFailure(error));
      console.log('Error deleting user:', error);
    }
  };

  // Show delete popup
  const showTasks = (user) => {
    setSelectedUser(user);
    setshowTaskPopup(true);
  };

  return (
    <div className="flex min-h-screen bg-white justify-center items-top">
      <div className="w-2/3 bg-white shadow-md rounded p-6">
        <Link to="/createStudent">
          <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:bg-green-600 disabled:opacity-80">
            Create Student
          </button>
        </Link>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="border border-gray-300 px-0 py-0">Sl. Number</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              {/* <th className="border border-gray-300 px-4 py-2">Email</th> */}
              <th className="border border-gray-300 px-4 py-2">Department</th>
              <th className="border border-gray-300 px-4 py-2">Task</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="odd:bg-gray-100 even:bg-white">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                {/* <td className="border border-gray-300 px-4 py-2">{user.email}</td> */}
                <td className="border border-gray-300 px-4 py-2">{user.department}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center">
                  <Link to={`/assignTask/${user.id}`}>
                    <button className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600">
                      Assign Task
                    </button>
                  </Link>
                  <button
                    onClick={() => showTasks(user)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Show Tasks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task show Popup */}
      {showTaskPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">Delete User</h2>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to delete user <strong>{selectedUser.name}</strong> ?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setshowTaskPopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => handleShowTask(selectedUser.id)}
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
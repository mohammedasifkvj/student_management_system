import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  getUser,
  showTaskStart,
  showTaskSuccess,
  showTaskFailure,
} from '../redux/admin/adminSlice';

export default function StudentsList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);

  const [showTaskPopup, setshowTaskPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]); // State to store tasks for selected user

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/admin/studentsList');
        dispatch(getUser(response.data));
        // console.log(response.data);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchStudents();
  }, [dispatch]);

  // fetch tasks and show the popup for the selected user
  const showTasks = async (user) => {
    setSelectedUser(user);
    try {
      dispatch(showTaskStart());
      const response = await axios.get(`/api/admin/showTask/${user.id}`);
      setTasks(response.data.tasks);
      dispatch(showTaskSuccess(user.id));
    } catch (error) {
      dispatch(showTaskFailure(error));
      console.log('Error fetching tasks:', error);
      setTasks([]);
    }
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
              <th className="border border-gray-300 px-4 py-2">Department</th>
              <th className="border border-gray-300 px-4 py-2">Task</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="odd:bg-gray-100 even:bg-white">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.department}
                </td>
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

      {/* Task Popup */}
      {showTaskPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">
              Assigned Tasks for {selectedUser?.name}
            </h2>

            {tasks && tasks.length > 0 ? (
              <ul className="space-y-4 ">
                {tasks.map((task) => (
                  <li key={task._id} className="p-4 border rounded-lg text-center">
                    <h3 className="text-lg font-semibold">{task.taskName}</h3>
                    <p className="text-gray-600">{task.description}</p>
                    {task.dueTime && (
                      <p className="text-sm text-gray-500">
                        Due : {new Date(task.dueTime).toLocaleDateString()}
                      </p>
                    )}
                    {/* Status with color coding */}
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full
                        ${task.status === 'pending' ? 'bg-yellow-500' : ''}
                        ${task.status === 'completed' ? 'bg-green-500' : ''}
                        ${task.status === 'overdue' ? 'bg-red-500' : ''}`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tasks assigned.</p>
            )}

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setshowTaskPopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
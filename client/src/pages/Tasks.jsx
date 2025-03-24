import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { setTasks, updateTaskStatus } from '../redux/slice/userSlice.js';
import Column from '../components/Column.jsx';

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const columns = useSelector((state) => state.user.columns);
  const tasks = useSelector((state) => state.user.tasks);
console.log(tasks)
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ taskName: ' ', details: ' ' });

  // Fetch tasks from the backend when the component loads
  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/user/getTasks');

      console.log('API Response:', response);

      // const { tasks, columns } = response.data;

      if (!tasks ) {
        console.error('Invalid data structure from API:', response.data);
        return;
      }
      if (!columns) {
        console.error('Column structure from API:', response.data);
        return;
      }

      // Dispatch both tasks and columns to Redux
      dispatch(setTasks({ tasks, columns }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  fetchTasks();
}, [dispatch]);


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || !active) return;

    const taskId = active.id;
    const targetColumn = over.id;

    if (!taskId || !targetColumn) return;

    dispatch(updateTaskStatus({ taskId, newStatus: targetColumn }));

    // Optionally, update the task status in the backend
    axios
      .put(`/api/tasks/${taskId}`, { status: targetColumn })
      .catch((error) => console.error('Error updating task status:', error));
  };

  //Task add states
  const [formData, setFormData] = useState({ taskName: '', details: '' });
  const { loading1, error } = useSelector((state) => state.user);

  const [showTaskPopup, setShowTaskPopup] = useState(false);

  const validate = (name, value) => {
    switch (name) {
      case 'taskName':
        if (value.trim().length < 4) {
          return 'Task must be at least 4 characters long and cannot be only spaces.';
        }
        return '';
      case 'details':
        if (value.trim().length < 8) {
          return 'Task details must be at least 8 characters long and cannot be only spaces.';
        }
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
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setLoading(true);

      // Use axios to make the POST request
      const response = await axios.post('/api/user/createTask', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      setLoading(false);

      if (data.success === false) {
        console.error('Task creation failed:', data.message || 'Unknown error');
        return;
      }

      // Reset form and close popup on successful task creation
      setFormData({ taskName: '', details: '' });
      setShowTaskPopup(false); // Close the popup

      // Optionally update tasks state in Redux if needed
      // dispatch(addNewTask(data.task)); // Uncomment if Redux is used for task state
    } catch (error) {
      setLoading(false);
      console.error('Error submitting the task:', error.response?.data || error.message);
    }
  };



  // Show task add popup
  const addTask = () => {
    setShowTaskPopup(true);
  };


  return (
    <div >
      <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 p-4 bg-white-950"> {/* teal */}

          <button
            onClick={() => addTask()}
            className="bg-yellow-700 text-white p-3 rounded-lg uppercase hover:bg-green-600 disabled:opacity-80">
            Create Task
          </button>

          {/* {columns?.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))} */}
        </div>
      </DndContext>
      </div>
      <div>

      {/* Add task pop-up */}
      {showTaskPopup && (
        <div className='p-3 max-w-lg mx-auto'>
          <h1 className='text-3xl text-center font-semibold my-7'>Add Task</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Task name"
              id="taskName"
              autoComplete="off"
              value={formData.taskName}
              required
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />
            {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName}</p>}

            <textarea
              type="text"
              placeholder="Task Details"
              id="details"
              autoComplete="off"
              value={formData.details}
              required
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />
            {errors.details && <p className="text-red-500 text-sm">{errors.details}</p>}

            {/* Add task button */}
            <button
              type="submit" // Ensures this triggers form submission
              disabled={loading || !isFormValid()}
              className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? 'Loading...' : 'Add Task'}
            </button>

            {/* Close button */}
            <button
              type="button" // Use type="button" to avoid triggering form submission
              onClick={() => setShowTaskPopup(false)}
              className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
            >
              Close
            </button>
          </form>

          <p className='text-red-700 text-center mt-5'>
            {error ? error.message || 'Something went wrong!' : ''}
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Tasks;

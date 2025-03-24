import React, { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setTasks, updateTaskStatus } from '../redux/slice/userSlice';
import Column from '../components/Column.jsx';

const Tasks = () => {
  const dispatch = useDispatch();

  const columns = useSelector((state) => state.user.columns);
  const tasks = useSelector((state) => state.user.tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/user/getTasks');
        if (!response.data.tasks || !Array.isArray(response.data.tasks)) {
          throw new Error('Invalid data structure from API: Tasks not found');
        }
        console.log('Fetched tasks:', response.data.tasks);
        dispatch(setTasks(response.data.tasks));
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
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

  const defaultColumns = [
    { id: 'pending', title: 'Pending Tasks' },
    { id: 'in-progress', title: 'In Progress Tasks' },
    { id: 'completed', title: 'Completed Tasks' },
  ];

  const columnsToRender = columns?.length > 0 ? columns : defaultColumns;

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 p-4 bg-white-950">
          {columnsToRender.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Tasks;

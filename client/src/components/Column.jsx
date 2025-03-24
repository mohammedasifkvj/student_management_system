import React from 'react';
import Task from './Task.jsx';
import { useDroppable } from '@dnd-kit/core';

const Column = ({ column, tasks = [] }) => {
  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-teal-800 rounded-md p-4 shadow-md h-screen"
    >
      <h3 className="text-xl font-   mb-4 text-neutral-50">{column.title}</h3>
      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => <Task key={task._id} task={task} />)
        ) : (
          <p className="text-neutral-300">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default Column;
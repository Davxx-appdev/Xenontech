import React, { useState, useEffect, useRef } from 'react';

const ToDoList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const nextId = useRef(tasks.length);
  const editRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setEditingId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const addTask = () => {
    if (input.trim() !== '') {
      const newTask = { id: nextId.current++, text: input, completed: false };
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setInput('');
    }
  };

  const toggleTaskCompletion = (id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleEdit = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const startEditing = (id) => {
    setEditingId(id);
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Separate incomplete and complete tasks
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completeTasks = tasks.filter(task => task.completed);

  const renderTasks = (taskList) => (
    <ul>
      {taskList.map((task) => (
       <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
       <div className="task-text-container" ref={editingId === task.id ? editRef : null}>
         {editingId === task.id ? (
           <textarea
             className="task-input"
             value={task.text}
             onChange={(e) => handleEdit(task.id, e.target.value)}
             autoFocus
           />
         ) : (
           <span 
             onClick={() => startEditing(task.id)} 
             className="task-text"
           >
             {task.text}
           </span>
         )}
       </div>
       <span onClick={() => toggleTaskCompletion(task.id)} className="task-toggle">
         {task.completed ? '✓' : '⚪'}
       </span>
     </li>
      ))}
    </ul>
  );

  return (
    <div className="todo-list-container">
      <header className="todo-header">
        <h1>To-Do List</h1>
      </header>
      <div className="input-area">
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a new task"
          className="task-input"
        />
        <button onClick={addTask} className="add-task-button">+</button>
      </div>

      {renderTasks(incompleteTasks)}

      {completeTasks.length > 0 && (
  <div className="separator">
    <span>Completed Tasks</span>
    <hr />
  </div>
)}

      {renderTasks(completeTasks)}

      {completeTasks.length > 0 && (
        <button onClick={clearCompletedTasks} className="clear-completed-button">
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
};

export default ToDoList;
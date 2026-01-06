import React, { useState } from 'react';

const TaskInput = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState(''); // ISO string or simple date string

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTask(text, deadline);
    setText('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-input">
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="タスクを入力するにゃ..." 
      />
       {/* 期限入力は簡易的に日時選択 */}
      <input 
        type="datetime-local" 
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default TaskInput;

import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
    return (
        <li className={`task-item ${task.completed ? 'completed' : ''}`}>
            <label>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                />
                <span className="task-text">{task.text}</span>
            </label>

            {task.deadline && (
                <span className="task-deadline">
                    期限: {format(new Date(task.deadline), 'M/d HH:mm', { locale: ja })}
                </span>
            )}

            <button onClick={() => onDelete(task.id)} className="delete-btn" aria-label="削除">
                ×
            </button>
        </li>
    );
};

export default TaskItem;

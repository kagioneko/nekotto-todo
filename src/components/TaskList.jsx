import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
    if (tasks.length === 0) {
        return <div className="empty-message">タスクはないようです。ゆっくり休みましょう。</div>;
    }

    return (
        <ul className="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

export default TaskList;

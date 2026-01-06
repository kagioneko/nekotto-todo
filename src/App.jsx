import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { differenceInMinutes } from 'date-fns';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import CatDisplay from './components/CatDisplay';

function App() {
  // ローカルストレージから初期状態を読み込む
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('nekotto-todo-tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  });
  const [catState, setCatState] = useState('normal');

  // タスクが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('nekotto-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // タスクの状態変更や追加削除
  const addTask = (text, deadline) => {
    const newTask = {
      id: uuidv4(),
      text,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 猫の状態を監視するエフェクト
  useEffect(() => {
    const updateCatState = () => {
      const now = new Date();
      const incompleteTasks = tasks.filter(t => !t.completed);

      if (tasks.length === 0) {
        setCatState('normal');
        return;
      }

      // 1. 全て完了している場合
      if (incompleteTasks.length === 0) {
        setCatState('done');
        return;
      }

      // 2. 有効なタスク（期限切れでないタスク）があるかチェック
      const validTasks = incompleteTasks.filter(t => !t.deadline || new Date(t.deadline) >= now);

      if (validTasks.length > 0) {
        // 有効なタスクの中に、期限が24時間以内のものがあるか
        const hasUrgent = validTasks.some(t => {
          if (!t.deadline) return false;
          const diff = differenceInMinutes(new Date(t.deadline), now);
          return diff > 0 && diff <= 1440; // 24時間以内
        });

        if (hasUrgent) {
          setCatState('urgent');
        } else {
          setCatState('normal');
        }
        return;
      }

      // 3. 有効なタスクがなく、期限切れのみの場合
      // （ここに来る時点で incompleteTasks.length > 0 なので、全て期限切れということになる）
      setCatState('gone');
    };

    updateCatState();
    // 1分ごとに更新（期限監視のため）
    const interval = setInterval(updateCatState, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="app-container">
      <header>
        <h1>ねこっと ToDo <span className="paw-print">🐾</span></h1>
      </header>

      <main className="main-layout">
        <div className="task-section">
          <TaskInput onAddTask={addTask} />
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
          />
        </div>

        <div className="cat-section">
          <CatDisplay catState={catState} />
          {/* デバッグ用: 状態表示 */}
          {/* <p style={{fontSize: '0.8rem', color: '#ccc'}}>State: {catState}</p> */}
        </div>
      </main>
    </div>
  );
}

export default App;

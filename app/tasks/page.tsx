'use client';

import { useEffect, useState } from 'react';
import UserSelect from '@/app/components/users/UserSelect';
import TaskList from '@/app/components/tasks/TaskList';
import { task } from '@/app/generated/prisma/client';

interface User {
    userId: number;
    fname: string;
    lname: string;
    email: string;
}

const TasksPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [tasks, setTasks] = useState<task[]>([]);
    const [visibleTasks, setVisibleTasks] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error('Failed to load users:', err));
    }, []);

    useEffect(() => {
        if (selectedUserId === null) {
            setTasks([]);
            return;
        }

        setLoading(true);
        const url =
            selectedUserId === -1
                ? '/api/tasks'
                : `/api/tasks?userId=${selectedUserId}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setTasks(data.tasks);
                const visibilityMap: Record<number, boolean> = {};
                data.tasks.forEach((task: task) => {
                    visibilityMap[task.taskId] = true;
                });
                setVisibleTasks(visibilityMap);
            })
            .catch((err) => console.error('Failed to fetch tasks:', err))
            .finally(() => setLoading(false));
    }, [selectedUserId]);

    const handleDelete = async (taskId: number) => {
        console.log(`Deleting task ${taskId}`);
    };

    const handleComplete = async (taskId: number) => {
        console.log(`Completing task ${taskId}`);
    };

    return (
        <div className="p-6 space-y-6">
            <UserSelect
                users={users}
                selectedUserId={selectedUserId}
                onChange={setSelectedUserId}
            />

            <TaskList
                tasks={tasks}
                loading={loading}
                visibleTasks={visibleTasks}
                selectedUserId={selectedUserId}
                onDelete={handleDelete}
                onComplete={handleComplete}
            />
        </div>
    );
};

export default TasksPage;

'use client';

import { useEffect, useState } from 'react';
import UserSelect from '@/app/components/users/UserSelect';
import TaskList from '@/app/components/tasks/TaskList';
import { task } from '@/app/generated/prisma/client';
import Link from "next/link";

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
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then(setUsers)
            .catch((err) => console.error('Failed to load users:', err));
    }, []);

    useEffect(() => {
        if (selectedUserId === null) {
            setTasks([]);
            return;
        }

        setLoading(true);
        const url = new URL('/api/tasks', window.location.origin);
        if (selectedUserId !== -1) {
            url.searchParams.set('userId', selectedUserId.toString());
        }
        url.searchParams.set('sortBy', sortBy);
        url.searchParams.set('sortOrder', sortOrder);

        fetch(url.toString())
            .then((res) => res.json())
            .then((data) => {
                setTasks(data.tasks);
                const visibility: Record<number, boolean> = {};
                data.tasks.forEach((t: task) => (visibility[t.taskId] = true));
                setVisibleTasks(visibility);
            })
            .catch((err) => console.error('Fetch tasks error:', err))
            .finally(() => setLoading(false));
    }, [selectedUserId, sortBy, sortOrder]);

    const handleDelete = (taskId: number) => {
        console.log(`Deleting task ${taskId}`);
    };

    const handleComplete = (taskId: number) => {
        console.log(`Completing task ${taskId}`);
    };

    return (
        <div className="p-6 space-y-4">
            <UserSelect
                users={users}
                selectedUserId={selectedUserId}
                onChange={setSelectedUserId}
            />

            {/* + New Task button (TailwindCSS styled) */}
            <div className="mb-4">
                <Link href="/tasks/new">
                    <button
                        type="button"
                        className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
                    >
                        + New Task
                    </button>
                </Link>
            </div>

            {selectedUserId !== null && (
                <div className="flex space-x-4 items-center">
                    <label>Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority')}
                        className="p-2 border rounded"
                    >
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="p-2 border rounded"
                    >
                        <option value="asc">
                            {sortBy === 'priority' ? 'Low → High' : 'Oldest → Newest'}
                        </option>
                        <option value="desc">
                            {sortBy === 'priority' ? 'High → Low' : 'Newest → Oldest'}
                        </option>
                    </select>
                </div>
            )}

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

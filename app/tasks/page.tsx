'use client';

import {useEffect, useMemo, useState} from 'react';
import UserSelect from '@/app/components/users/UserSelect';
import TaskList from '@/app/components/tasks/TaskList';
import ShowCompletedToggle from '@/app/components/tasks/ShowCompletedToggle';
import PaginationControls from '@/app/components/tasks/PaginationControls';
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
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // 📄 Pagination state
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // 👁‍🗨 Show/hide completed toggle
    const [showCompleted, setShowCompleted] = useState(false);

    // Fetch Users
    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then(setUsers)
            .catch((err) => console.error('Failed to load users:', err));
    }, []);


    // Fetch tasks when filter/sort changes
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
                console.log(
                    `🗂️ User ${selectedUserId} has ${data.tasks.length} tasks.`
                );
                setVisibleTasks(visibility);
            })
            .catch((err) => console.error('Fetch tasks error:', err))
            .finally(() => setLoading(false));
    }, [selectedUserId, sortBy, sortOrder]);

    // Reset to page 1 whenever tasks list or filter changes
    useEffect(() => {
        setPage(1);
    }, [tasks, showCompleted]);

    // Filter out completed if needed
    const filteredTasks = useMemo(
        () =>
            showCompleted ? tasks : tasks.filter((t) => t.status !== 'COMPLETED'),
        [tasks, showCompleted]
    );

    // Compute slicing for current page
    const totalPages = Math.ceil(filteredTasks.length / pageSize);
    const paginatedTasks = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredTasks.slice(start, start + pageSize);
    }, [filteredTasks, page]);

    // 1️⃣ DELETE handler
    const handleDelete = async (taskId: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        if (res.ok) {
            // Remove from both the full list and paginated slice
            setTasks(prev => prev.filter(t => t.taskId !== taskId));
        } else {
            console.error('Failed to delete task', await res.text());
        }
    };

    // 2️⃣ COMPLETE handler
    const handleComplete = async (taskId: number) => {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ complete: true }), // triggers your "mark complete" branch
        });
        if (res.ok) {
            const updated = await res.json();
            // Replace the single task and filter out completed items if you want:
            setTasks(prev =>
                prev
                    .map(t => (t.taskId === taskId ? updated : t))
                    .filter(t => t.status !== 'COMPLETED')
            );
        } else {
            console.error('Failed to mark complete', await res.text());
        }
    };


    return (
        <div className="p-6 space-y-4">
            <UserSelect
                users={users}
                selectedUserId={selectedUserId}
                onChange={setSelectedUserId}
            />

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
                    <ShowCompletedToggle
                            showCompleted={showCompleted}
                            onToggleAction={setShowCompleted}
                    />
                </div>
            )}

            <TaskList
                tasks={paginatedTasks}
                loading={loading}
                visibleTasks={visibleTasks}
                selectedUserId={selectedUserId}
                onDelete={handleDelete}
                onComplete={handleComplete}
            />
            {/* Pagination controls */}
            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChangeAction={setPage}
            />
        </div>
    );
};

export default TasksPage;

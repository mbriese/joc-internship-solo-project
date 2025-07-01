'use client';

import React from 'react';
import TaskCard from './TaskCard';
import BubblePopTaskCard from '@/app/components/animations/BubblePopTaskCard';
import { task } from '@/app/generated/prisma/client';

interface TaskListProps {
    tasks: task[];
    loading: boolean;
    visibleTasks: Record<number, boolean>;
    selectedUserId: number | null;
    onDelete: (taskId: number) => void;
    onComplete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
                                               tasks,
                                               loading,
                                               visibleTasks,
                                               selectedUserId,
                                               onDelete,
                                               onComplete,
                                           }) => {
    if (loading) return <p>🌀 Loading tasks...</p>;

    if (selectedUserId === null) {
        return <p className="text-zinc-500 italic">👀 Select a user to view their tasks.</p>;
    }

    if (tasks.length === 0) {
        return <p className="text-zinc-500 italic">📭 No tasks found for this user.</p>;
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <BubblePopTaskCard key={task.taskId} isVisible={visibleTasks[task.taskId]}>
                    <TaskCard
                        task={task}
                        onDelete={onDelete}
                        onComplete={onComplete}
                    />
                </BubblePopTaskCard>
            ))}
        </div>
    );
};

export default TaskList;

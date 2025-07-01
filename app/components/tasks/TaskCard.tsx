'use client';

import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { colorMaps } from "@/app/utils/colorMaps"; // Import the color maps
import { Priority, CategoryType, Status, Importance } from '@/app/generated/prisma/client';

type TaskPropsModel = {
    taskId: number;
    title: string;
    description: string;
    status: Status;
    category: CategoryType;
    priority: Priority;
    importance: Importance;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date;
    userId: number;
};

type TaskCardProps = {
    task: TaskPropsModel;
    onDelete: (id: number) => void;
    onComplete: (id: number) => void; // Pass onComplete handler here
};

const TaskCard = ({ task, onDelete, onComplete }: TaskCardProps) => {
    const formattedDueDate = new Date(task.dueDate).toLocaleDateString();

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white shadow rounded p-4 space-y-4"
        >

            <div>
                <h3
                    className={`text-lg font-semibold ${task.status ? 'text-gray-400' : ''}`}
                >
                    {task.title}
                </h3>
                <p className="text-gray-600 mb-2">{task.description}</p>

                <div className="text-sm text-gray-500 space-y-1">
                    <div>
                        <strong>Category:</strong>{' '}
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorMaps.category[task.category]}`}>
                            {task.category}
                        </span>
                    </div>
                    <div>
                        <strong>Status:</strong>{' '}
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorMaps.status[task.status]}`}>
                            {task.status}
                        </span>
                    </div>
                    <div>
                        <strong>Priority:</strong>{' '}
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorMaps.priority[task.priority]}`}>
                            {task.priority}
                        </span>
                    </div>
                    <div>
                        <strong>Importance:</strong>{' '}
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorMaps.importance[task.importance]}`}>
                            {task.importance}
                        </span>
                    </div>
                    <div>
                        <strong>Due:</strong> {formattedDueDate}
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 border-t pt-3">
                <Link
                    href={`/tasks/${task.taskId}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit task"
                >
                    <Pencil size={18} />
                </Link>

                {/* Mark as Complete Button */}
                <button
                    onClick={() => onComplete(task.taskId)} // Calls onComplete handler
                    className="text-green-600 hover:text-green-800"
                    title="Mark as complete"
                >
                    <CheckCircle size={18} />
                </button>

                <button
                    onClick={() => onDelete(task.taskId)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete task"
                >
                    <Trash2 size={18} />
                </button>
            </div>

        </motion.div>
    );
};

export default TaskCard;

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TaskForm, { TaskFormData } from '../../../components/tasks/TaskForm';
import Spinner from '../../../components/Spinner';


const EditTaskPage = () => {
    const { id } = useParams(); // grabs [id] from route
    const router = useRouter();

    const [task, setTask] = useState<TaskFormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    // ✅ Fetch task data on load
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch(`/api/tasks/${id}`);
                if (!res.ok) {
                    setError('Failed to load task');
                    setLoading(false);
                    return;
                }
                const data = await res.json();

                // ✅ Transform into TaskFormData (string dates, correct fields)
                const transformed: TaskFormData = {
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    category: data.category,
                    dueDate: data.dueDate?.slice(0, 10) ?? '', // 'YYYY-MM-DD'
                    priority: data.priority,
                    importance: data.importance,
                    userId: data.userId,
                };

                setTask(transformed);
            } catch (err) {
                console.error(err);
                setError('Could not load task');
            } finally {
                setLoading(false);
            }
        };

        void(fetchTask());
    }, [id]);

    // ✅ Handle form submission
    const handleUpdate = async (formData: TaskFormData) => {
        try {
            setSubmitting(true);
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                setError('Failed to load task');
                setLoading(false);
                return;
            }

            router.push('/tasks'); // ✅ redirect to task list
        } catch (err) {
            console.error(err);
            setError('Update failed.');
            setSubmitting(false);
        }
    };

    // UI states
    if (loading) return <Spinner />;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <TaskForm
            initialValues={task!}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            error={error}
        />
    );
};

export default EditTaskPage;

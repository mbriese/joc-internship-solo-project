'use client';


import {Button, Callout, TextField} from '@radix-ui/themes';

import dynamic from 'next/dynamic';
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
});

import "easymde/dist/easymde.min.css";
import {useRouter} from "next/navigation";
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createTaskSchema} from '@/app/validationSchemas';
import {z} from 'zod';
import {useEffect, useState} from 'react';
import {Status, CategoryType, Priority, Importance} from '@/app/generated/prisma/client';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';



export type TaskFormData = z.infer<typeof createTaskSchema>;

type TaskFormProps = {
    initialValues?: Partial<TaskFormData>;
    onSubmit: (data: TaskFormData) => void;
    isSubmitting?: boolean;
    error?: string;
};

const TaskForm = ({
                      initialValues = {},
                      onSubmit,
                      isSubmitting = false,
                      error,
                  }: TaskFormProps) => {
    const [isClient, setIsClient] = useState<boolean>(false)
    const [isSuccess, setSuccess] = useState(false)
    type UserOption = { userId: number; fname: string; lname: string };
    const [users, setUsers] = useState<UserOption[]>([]);

    const router = useRouter();
    const {
        title = '',
        description = '',
        status = undefined,
        category = undefined,
        dueDate = '',
        priority = undefined,
        importance = undefined,
    } = initialValues;

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<TaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title,
            description,
            status,
            category,
            dueDate,
            priority,
            importance,
            userId: initialValues.userId ?? 1,
        },
    });

    useEffect(() => {
        setIsClient(true);
        fetch('/api/users')
            .then(res => res.json())
            .then(setUsers)
            .catch(err => console.error("❌ Failed to load users:", err));
    }, []);


    const handleInternalSubmit = handleSubmit(
        async (data) => {
            const correctedData: TaskFormData = {
                ...data,
                userId: Number(data.userId), // 👈 Coerce string to number
            };
            void onSubmit(correctedData);
            //confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            router.push('/tasks');
        },
        (errors) => {
            console.log('❌ Validation failed:', errors);
        }
    );





    return (
        <div className="max-w-xl space-y-5">
            {error && (
                <Callout.Root color="red">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}
            {isSuccess && (
                <Callout.Root color="green">
                    <Callout.Text>✅ Task submitted successfully!</Callout.Text>
                </Callout.Root>
            )}


            <form onSubmit={handleInternalSubmit} className="space-y-4">

                <TextField.Root placeholder="Title" {...register('title')} />
                <ErrorMessage>{errors.title?.message}</ErrorMessage>

                {isClient &&
                    <Controller
                        name="description"
                        control={control}
                        render={({field}) =>
                            <SimpleMDE placeholder="Description" {...field} />}
                    />}
                <ErrorMessage>{errors.description?.message}</ErrorMessage>

                <div className="space-y-2">
                    <label htmlFor="Status">Status</label>
                    <select {...register('status')}>
                        <option value="">-- Choose status --</option>
                        {Object.values(Status).map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <ErrorMessage>{errors.status?.message}</ErrorMessage>

                <div className="space-y-2">
                    <label htmlFor="Category">Category</label>
                    <select {...register('category')}>
                        <option value="">-- Choose a category --</option>
                        {Object.values(CategoryType).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <ErrorMessage>{errors.category?.message}</ErrorMessage>

                <div className="space-y-2">
                    <label htmlFor="DueDate">Due Date</label>
                    <input type="date" {...register('dueDate')} />
                </div>
                <ErrorMessage>{errors.dueDate?.message}</ErrorMessage>

                <div className="space-y-2">
                    <label htmlFor="Priority">Priority</label>
                    <select {...register('priority')}>
                        <option value="">-- Choose priority --</option>
                        {Object.values(Priority).map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <ErrorMessage>{errors.priority?.message}</ErrorMessage>

                <div className="space-y-2">
                    <label htmlFor="Importance">Importance</label>
                    <select {...register('importance')}>
                        <option value="">-- Choose importance --</option>
                        {Object.values(Importance).map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <ErrorMessage>{errors.importance?.message}</ErrorMessage>

                <div className="space-y-2">
                    <label htmlFor="userId">Assign to User</label>
                    <select {...register('userId')} className="w-full p-2 border rounded">
                        <option value="">-- Select a user --</option>
                        {users.map((user) => (
                            <option key={user.userId} value={String(user.userId)}>
                                {user.fname} {user.lname}
                            </option>
                        ))}
                    </select>
                </div>
                <ErrorMessage>{errors.userId?.message}</ErrorMessage>


                <div className="space-y-2">
                    {/* ✅ Correct: This ensures the form is actually submitted */}
                    <Button type="submit"  disabled={isSubmitting} onClick={() => console.log('🖱️ clicked submit')}>
                        Submit Task {isSubmitting && <Spinner/>}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        color="gray"
                        onClick={() => {
                            reset(initialValues);         // ✅ resets initial values
                            setSuccess(false); // ✅ clears success state too, if needed
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default TaskForm;
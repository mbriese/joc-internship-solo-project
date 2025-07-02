'use client';

import { Button, Callout, TextField } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { createUserSchema } from '@/app/validationSchemas';
import Link from "next/link";

export type UserFormData = z.infer<typeof createUserSchema>;

type UserFormProps = {
    initialValues?: Partial<UserFormData>;
    onSubmit: (data: UserFormData) => void;
    isSubmitting?: boolean;
    error?: string;
};

const UserForm = ({
                      initialValues = {},
                      onSubmit,
                      isSubmitting = false,
                      error,
                  }: UserFormProps) => {
    const {
        fname ='',
        lname = '',
        email = '',
        description = '',
        createdAt,
        updatedAt,
    } = initialValues;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            fname,
            lname,
            email,
            description,
            createdAt,
            updatedAt,
        },
    });

    return (

            <div className="max-w-xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Create New User</h1>
        <Link href="/users">
            <Button variant="outline" color="gray" className="px-4 py-2">
                ← Back to Users
            </Button>
        </Link>
    </div>
        <div className="max-w-xl space-y-5">
            {error && (
                <Callout.Root color="red">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                <TextField.Root placeholder="First name" {...register('fname')} />
                </div>
                <ErrorMessage>{errors.fname?.message}</ErrorMessage>

                <div className="space-y-2">
                <TextField.Root placeholder="Last name" {...register('lname')} />
                </div>
                <ErrorMessage>{errors.lname?.message}</ErrorMessage>

                <div className="space-y-2">
                <TextField.Root placeholder="Email" {...register('email')} />
                </div>
                <ErrorMessage>{errors.email?.message}</ErrorMessage>
                <div className="space-y-2">
                <TextField.Root placeholder="Description" {...register('description')} />
                </div>
                <ErrorMessage>{errors.description?.message}</ErrorMessage>

                <Button disabled={isSubmitting}>
                    Submit User {isSubmitting && <Spinner />}
                </Button>
            </form>
        </div>
            </div>
    );
};

export default UserForm;

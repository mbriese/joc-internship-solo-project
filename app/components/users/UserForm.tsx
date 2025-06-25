'use client';

import { Button, Callout, TextField } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { createUserSchema } from '@/app/validationSchemas';

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
        <div className="max-w-xl space-y-5">
            {error && (
                <Callout.Root color="red">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextField.Root placeholder="First name" {...register('fname')} />
                <ErrorMessage>{errors.fname?.message}</ErrorMessage>

                <TextField.Root placeholder="Last name" {...register('lname')} />
                <ErrorMessage>{errors.lname?.message}</ErrorMessage>

                <TextField.Root placeholder="Email" {...register('email')} />
                <ErrorMessage>{errors.email?.message}</ErrorMessage>

                <TextField.Root placeholder="Description" {...register('description')} />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>

                <Button disabled={isSubmitting}>
                    Submit User {isSubmitting && <Spinner />}
                </Button>
            </form>
        </div>
    );
};

export default UserForm;

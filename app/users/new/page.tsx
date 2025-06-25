'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserForm, { UserFormData } from '../../components/users/UserForm';

const NewUserPage = () => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    const handleCreate = async (data: UserFormData) => {
        try {
            setSubmitting(true);
            await axios.post('/api/users', data);
            router.push('/users');
        } catch (error) {
            setSubmitting(false);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <UserForm
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
            error={error}
        />
    );
};

export default NewUserPage;

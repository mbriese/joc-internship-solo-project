'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Card } from '@radix-ui/themes';

type User = {
    id: number;
    fname: string;
    lname: string;
    email: string;
    description: string;
};

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(data);
            setLoading(false);
        };

        void fetchUsers(); // 👈 avoids "ignored promise" warning
    }, []);

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-6">
            <Link href="/users/new">
                <button
                    type="button"
                    className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
                >
                    + New User
                </button>
            </Link>

            {loading && <p>Loading users...</p>}

            {!loading && users.length === 0 && (
                <p className="text-gray-600">No users found. Try adding one!</p>
            )}

            <div className="space-y-4">
                {users.map((user) => (
                    <Card key={`${user.fname}-${user.lname}`} className="p-4">
                        <div className="text-lg font-medium">{user.fname}</div>
                        <div className="text-lg font-medium">{user.lname}</div>
                        <div className="text-gray-600">{user.email}</div>
                        <div className="text-lg font-medium">{user.description}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;


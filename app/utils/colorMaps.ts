import { Priority, Status, CategoryType, Importance } from '@/app/generated/prisma/client';

export const colorMaps = {
    priority: {
        URGENT: 'bg-red-100 text-black-700',
        HIGH: 'bg-orange-100 text-orange-700',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        LOW: 'bg-green-100 text-green-700',
    },
    importance: {
        HIGH: 'bg-orange-100 text-orange-900',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        LOW: 'bg-green-100 text-green-700',
    },
    category: {
        WORK: 'bg-blue-100 text-blue-700',
        PERSONAL: 'bg-purple-100 text-purple-700',
        ERRANDS: 'bg-green-100 text-green-700',
        HEALTH: 'bg-pink-100 text-pink-700',
        FINANCE: 'bg-yellow-100 text-yellow-700',
        LEARNING: 'bg-indigo-100 text-indigo-700',
        OTHER: 'bg-gray-200 text-gray-800',
    },
    status: {
        OPEN: 'bg-gray-100 text-gray-700',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
        INCOMPLETE: 'bg-gray-100 text-yellow-800',
        COMPLETED: 'bg-blue-100 text-yellow-800',
        CLOSED: 'bg-green-100 text-green-800',
    },
};

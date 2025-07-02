// app/components/tasks/PaginationControls.tsx
'use client';

import React from 'react';

type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onPageChangeAction: (page: number) => void;
};

export default function PaginationControls({
                                               currentPage,
                                               totalPages,
                                               onPageChangeAction,
                                           }: PaginationControlsProps) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center space-x-2 mt-4">
            <button
                onClick={() => onPageChangeAction(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
                Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChangeAction(p)}
                    className={`px-3 py-1 rounded-full ${
                        p === currentPage
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChangeAction(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

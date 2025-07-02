// app/components/tasks/ShowCompletedToggle.tsx
'use client';

import React from 'react';

type ShowCompletedToggleProps = {
    showCompleted: boolean;
    onToggleAction: (show: boolean) => void;
};

export default function ShowCompletedToggle({
                                                showCompleted,
                                                onToggleAction,
                                            }: ShowCompletedToggleProps) {
    return (
        <label className="inline-flex items-center space-x-2">
            <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => onToggleAction(e.target.checked)}
                className="form-checkbox h-5 w-5 text-green-600"
            />
            <span className="text-sm">Show Completed</span>
        </label>
    );
}

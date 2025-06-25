'use client';

import { labelFormatters } from "@/app/utils/formatters";
import { colorMaps } from "@/app/utils/colorMaps"; // Import the color maps
import { Priority, Status, CategoryType, Importance } from '@/app/generated/prisma/client';

type BadgeProps =
    | { type: 'priority'; value: Priority }
    | { type: 'status'; value: Status }
    | { type: 'category'; value: CategoryType }
    | { type: 'importance'; value: Importance };

const Badge = ({ type, value }: BadgeProps) => {
    let style = '';

    if (type === 'priority') {
        style = colorMaps.priority[value as Priority];
    } else if (type === 'importance') {
        style = colorMaps.importance[value as Importance];
    } else if (type === 'status') {
        style = colorMaps.status[value as Status];
    } else if (type === 'category') {
        style = colorMaps.category[value as CategoryType];
    }

    return (
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${style}`}>
            {labelFormatters(value)}
        </span>
    );
};

export default Badge;

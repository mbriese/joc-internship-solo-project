import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

import { Status, CategoryType } from "@/app/generated/prisma/client";
import { createTaskSchema } from "@/app/validationSchemas";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // 1) Parse filters
    const userIdParam = searchParams.get('userId');
    const statusParam = searchParams.get('status');
    const categoryParam = searchParams.get('category');
    const where: Prisma.TaskWhereInput = {}
    if (userIdParam) where.userId = Number(userIdParam);
    if (statusParam) where.status = statusParam as Status;
    if (categoryParam) where.category = categoryParam as CategoryType;

    // 2) Parse sorting
    const validSortBy = ['dueDate', 'createdAt', 'priority'] as const;
    const sortByParam = searchParams.get('sortBy') as string;
    const sortBy = validSortBy.includes(sortByParam as any)
        ? sortByParam
        : 'dueDate';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';

    // 3) Build the base prisma options
    const findOptions: any = {
        where,
        orderBy: { [sortBy]: sortOrder },
    };

    // 4) Conditionally apply pagination only if both params are present
    if (searchParams.has('page') && searchParams.has('pageSize')) {
        const page = Math.max(parseInt(searchParams.get('page')!, 10), 1);
        const pageSize = Math.min(
            Math.max(parseInt(searchParams.get('pageSize')!, 10), 1),
            50
        );
        findOptions.skip = (page - 1) * pageSize;
        findOptions.take = pageSize;
    }

    // 5) Run the count + findMany in a transaction
    const [total, tasks] = await prisma.$transaction([
        prisma.task.count({ where }),
        prisma.task.findMany(findOptions),
    ]);

    // 6) Return both total & tasks
    return NextResponse.json({ total, tasks });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
        console.log("❌ Validation failed:", validation.error.format());
        return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { title, description, status, category, dueDate, priority, importance, userId } = validation.data;
    // Validate that userId is provided and is a valid number
    if (!userId || isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
    }
    const dueDateObj = new Date(dueDate ?? Date.now());

    const newTask = await prisma.task.create({
        data: {
            title,
            description,
            status,
            category,
            priority,
            importance,
            dueDate: dueDateObj,
            userId: userId,
        },
    });

    return NextResponse.json(newTask, { status: 201 });
}

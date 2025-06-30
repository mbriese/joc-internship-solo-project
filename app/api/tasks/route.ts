import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/index";
import { Status, CategoryType } from "@/app/generated/prisma/client";
import { createTaskSchema } from "@/app/validationSchemas";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    // Fetch the userId from query params, default to undefined if not provided
    const userId = searchParams.get("userId") || undefined;
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;

    const validSortBy = ["dueDate", "createdAt", "priority"] as const;
    const sortByParam = searchParams.get("sortBy");
    const sortBy = validSortBy.includes(sortByParam as never) ? sortByParam! : "dueDate";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "10", 10), 1), 50);
    const skip = (page - 1) * pageSize;

    const where = {
        ...(userId && { userId: Number(userId) }),
        ...(status && { status: status as Status }),
        ...(category && { category: category as CategoryType }),
    };

    const [total, tasks] = await prisma.$transaction([
        prisma.task.count({ where }),
        prisma.task.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { [sortBy]: sortOrder },
        }),
    ]);

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

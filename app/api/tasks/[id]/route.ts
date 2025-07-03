import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { CategoryType, Status, Priority, Importance } from '@/app/generated/prisma/client';
import { createTaskSchema } from '@/app/validationSchemas';

type Params = { id: string };

// ✅ GET /api/tasks/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
    ){
    console.log('in GET ', request.url);

    const { id } = await params;
    console.log('got id: ', id);
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { taskId } });
    if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
}

// ✅ DELETE /api/tasks/[id]
export async function DELETE(
    request: NextRequest,
    {params}: { params: { id: string } }) {
    const { id } = await params;
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
        return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    await prisma.task.delete({ where: { taskId } });
    return NextResponse.json({ success: true });
}

// ✅ PATCH /api/tasks/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<Params> }) {
    const { id } = await params;
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
        return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log('🎯 PATCH body:', body);

    // Check if the request is for marking the task as completed
    if (body.complete) {
        const updated = await prisma.task.update({
            where: { taskId },
            data: { status: Status.COMPLETED },
        });
        return NextResponse.json(updated);
    }

    // Otherwise, handle regular task updates
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.format() },
            { status: 400 }
        );
    }

    const data = parsed.data;
    const updated = await prisma.task.update({
        where: { taskId },
        data: {
            title: data.title,
            description: data.description,
            category: CategoryType[data.category as keyof typeof CategoryType],
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            status: Status[data.status as keyof typeof Status],
            priority: Priority[data.priority as keyof typeof Priority],
            importance: Importance[data.importance as keyof typeof Importance],
            userId: data.userId,
        },
    });

    return NextResponse.json(updated);
}

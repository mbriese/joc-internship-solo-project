import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { CategoryType, Status, Priority, Importance } from '@/app/generated/prisma/client';
import { createTaskSchema } from '@/app/validationSchemas';

// ✅ GET /api/tasks/[id]
export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
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

export async function DELETE(
    _request: NextRequest,

    { params }: { params: { id: string } }
) {
    const { id } = params;
    const taskId = parseInt(id, 10);


    if (isNaN(taskId)) {
        return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    await prisma.task.delete({ where: { taskId } });
    return NextResponse.json({ success: true });
}



// ✅ PATCH /api/tasks/[id]
export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
        return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log('🎯 PATCH body:', body);

    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
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

import {NextRequest, NextResponse} from "next/server";
import { z } from "zod";
import {PrismaClient} from "@/app/generated/prisma/index"

const prisma = new PrismaClient()

const createUserSchema = z.object({
    fname: z.string().min(1).max(255),
    lname: z.string().min(1).max(255),
    email: z.string().min(1),
    description: z.string().min(1).max(255),
})

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST (request: NextRequest) {
    const body = await request.json();
    console.log(JSON.stringify(body));

    const validation = createUserSchema.safeParse(body);
    console.log(JSON.stringify(validation));
    if (!validation.success)
        return NextResponse.json(validation.error.errors, {status: 400})

    const newUser = await prisma.user.create({
        data: {fname: body.fname, lname: body.lname, email: body.email, description: body.description},
    });
    return NextResponse.json(newUser, {status: 201});
}
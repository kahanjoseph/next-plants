import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const families = await prisma.cultivar.findMany();

        return NextResponse.json(families, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch plants." },
            { status: 500 }
        );
    }
}

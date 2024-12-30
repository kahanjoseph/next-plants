import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        return NextResponse.json(await prisma.species.findMany(), { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch plants." },
            { status: 500 }
        );
    }
}

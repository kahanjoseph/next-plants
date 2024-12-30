import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get all plants including associated species, cultivars, and family
        const plants = await prisma.plant.findMany({
            select: {
                id: true,
                name: true,
                datePlanted: true,
                notes: true,
                cultivars: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                species: {
                    select: {
                        id: true,
                        name: true,
                        family: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(plants, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch plants." },
            { status: 500 }
        );
    }
}


export async function POST(req: Request) {
    try {
        // Parse the JSON body from the request
        const parsedReq = await req.json();
        const {familyName, speciesName, plantName, cultivarNames} = parsedReq;

        if (!speciesName || !familyName) {
            return NextResponse.json(
                { error: "All fields (plantName, speciesName, cultivarName, familyName) are required." },
                { status: 400 }
            );
        }

        // Step 1: Check if the family exists, else create it
        let family = await prisma.family.findUnique({
            where: { name: familyName },
        });

        if (!family) {
            family = await prisma.family.create({
                data: { name: familyName },
            });
        }

        // Step 2: Check if the species exists, else create it
        let species = await prisma.species.findUnique({
            where: {
                familyId_name: { // Use the auto-generated field name for the compound constraint
                    familyId: family.id,
                    name: speciesName,
                },
            },
        });

        if (!species) {
            species = await prisma.species.create({
                data: {
                    name: speciesName,
                    familyId: family.id, // Link the family to this species
                },
            });
        }

        await prisma.plant.create({
            data: {
                datePlanted: parsedReq?.datePlanted,
                name: plantName,
                notes: parsedReq?.notes,
                speciesId: species.id, // Link the species to the plant
                cultivars: {
                    connectOrCreate: cultivarNames.map((cultivar: string) => ({
                        where: {
                            name_speciesId: {              // Use compound unique constraint (assumes your schema defines it)
                                name: cultivar,
                                speciesId: species.id,
                            },
                        },
                        create: {
                            name: cultivar,                // Create Cultivar if it doesn't exist
                            speciesId: species.id,
                        },
                    })),
                },
            },
        });

        return NextResponse.json(
            { message: "Plant created successfully (and related entities)!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating plant:", error);
        return NextResponse.json(
            { error: "Failed to create plant." },
            { status: 500 }
        );
    }
}

'use server';

import {prisma} from "@/lib/prisma";
import { revalidatePath } from 'next/cache';

interface Species {
    family: string;
    species: string;
    cultivars?: string[];
    notes?: string | undefined;
    planted: Date;
}

const createPlant = async (obj: Species) => {
    // Step 1: Check if the family exists, else create it
    let family = await prisma.family.findUnique({
        where: { name: obj.family },
    });

    if (!family) {
        family = await prisma.family.create({
            data: { name: obj.family },
        });
    }

    // Step 2: Check if the species exists, else create it
    let species = await prisma.species.findUnique({
        where: {
            familyId_name: { // Use the auto-generated field name for the compound constraint
                familyId: family.id,
                name: obj.species,
            },
        },
    });

    if (!species) {
        species = await prisma.species.create({
            data: {
                name: obj.species,
                familyId: family.id, // Link the family to this species
            },
        });
    }

    await prisma.plant.create({
        data: {
            datePlanted: obj.planted,
            // name: obj.name,
            ...(obj.notes ? { notes: obj.notes } : { notes: "" }),
            speciesId: species.id, // Link the species to the plant
            ...(obj.cultivars ? { cultivars: { connectOrCreate: obj.cultivars.map((cultivar: string) => ({
                where: {
                    speciesId_name: { // Use compound unique constraint
                        name: cultivar,
                        speciesId: species.id,
                    },
                },
                create: {
                    name: cultivar, // Create cultivar if it doesn't exist
                    speciesId: species.id,
                },
            })),
            } } : {}),
        },
    });

    revalidatePath('/');
}

export {createPlant}

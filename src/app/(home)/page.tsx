import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Modal from "@/app/(home)/components/Modal";
import {Suspense} from "react";
import {JSONFetch} from "@/lib/fetch";

type Cultivar = {
  name: string;
}

type Family = {
  name: string;
}

type Species = {
  name: string;
  family: Family;
}

type Plant = {
  id: number;
  name: string;
  species: Species;
  cultivars: Cultivar[];
  family: string;
  notes: string;
  datePlanted: Date;
}

export default async function Home() {

  const plants = await JSONFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plants`);
  const species = await JSONFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/species`);
  const families = await JSONFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/families`);
  const cultivars = await JSONFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cultivars`);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="">
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Cultivars</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Family</TableHead>
                <TableHead className="text-right">Notes</TableHead>
                <TableHead className="text-right">Date Planted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {plants.map((plant: Plant) => (
                    <TableRow key={plant.id}>
                      <TableCell className="font-medium">{plant.name}</TableCell>
                      <TableCell>{plant.cultivars.map(n => n.name).join(", ")}</TableCell>
                      <TableCell>{plant.species.name}</TableCell>
                      <TableCell>{plant.species.family.name}</TableCell>
                      <TableCell className="text-right">{plant.notes}</TableCell>
                      <TableCell className="text-right">{new Date(plant.datePlanted).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Suspense>
              <Modal families={families} species={species} cultivars={cultivars}/>
            </Suspense>
          </div>

        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}

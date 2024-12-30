'use client'
import { Family, Species, Cultivar } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {FC, useState} from "react";
import {Button} from "@/components/ui/button";
import { useForm } from "react-hook-form"
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import CreatableSelectField from "@/app/(home)/components/CreatableSelectField";
import {Textarea} from "@/components/ui/textarea";
import DateField from "@/app/(home)/components/DateField";
import {createPlant} from "@/lib/data";
import { clsx } from 'clsx';

interface ModalProps {
    families: Family[]; // Accept an array of Family objects
    species: Species[];
    cultivars: Cultivar[];
}

interface Option {
    value: string;
    label: string;
}

const FormSchema = z.object({
    planted: z.date({
        required_error: "A planted date is required.",
    }),
    cultivars: z.array(z.any()).optional(),
    notes: z.string().optional(),
    family: z.string({
        required_error: "A family is required."
    }),
    species: z.string({
        required_error: "A species is required."
    }),
})

const Modal: FC<ModalProps> = ({families, species, cultivars}) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const familyWatcher = form.watch("family");
    const speciesWatcher = form.watch("species");

    const speciesOptions = species.map((family) => {
        return {value: family?.name, label: family?.name.charAt(0).toUpperCase() + family?.name.slice(1)}
    })

    const familyOptions = families.map((family) => {
        return {value: family?.name, label: family?.name.charAt(0).toUpperCase() + family?.name.slice(1)}
    })

    const cultivarOptions = cultivars.map((cultivar) => {
        return {value: cultivar?.name, label: cultivar?.name.charAt(0).toUpperCase() + cultivar?.name.slice(1)}
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            console.log(data)
            await createPlant(data)
            setOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Button onClick={() => {setOpen(true)}}>Add New Plant</Button>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new plant</DialogTitle>
                        <DialogDescription>
                            ..............
                        </DialogDescription>

                        <>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                    <CreatableSelectField isMulti={false} options={familyOptions} name='family' control={form.control} label='Select or create a family' />
                                    {familyWatcher && (
                                        <CreatableSelectField isMulti={false} options={speciesOptions} name='species' control={form.control} label='Select or create a species' />
                                    )}
                                    {speciesWatcher && (
                                        <>
                                            <CreatableSelectField
                                                name="cultivars"
                                                label="Cultivars"
                                                description="Select or create cultivars relevant to your submission."
                                                options={cultivarOptions}
                                                control={form.control}
                                                isMulti={true}
                                            />
                                            <DateField form={form}/>
                                            <FormField
                                                control={form.control}
                                                name="notes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Notes</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Type your message here." id="message-2" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Notes about plant.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}
                                    <Button disabled={form.formState.isSubmitting} className={clsx(form.formState.isSubmitting && "opacity-50 cursor-not-allowed")}>Submit</Button>
                                </form>
                            </Form>
                        </>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </>
    )
}
export default Modal

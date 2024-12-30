import { FC } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Creatable from "react-select/creatable";
import { ControllerRenderProps } from "react-hook-form";
import { MultiValue, SingleValue } from "react-select";

interface Option {
    value: string;
    label: string;
}

interface CreatableSelectFieldProps {
    name: string;
    label: string;
    description?: string;
    options: Option[]; // Options to choose from
    control: any; // React Hook Form's control object
    isMulti?: boolean; // Toggle between multi and single select
}

const CreatableSelectField: FC<CreatableSelectFieldProps> = ({
                                                                 name,
                                                                 label,
                                                                 description,
                                                                 options,
                                                                 control,
                                                                 isMulti = true, // Multi-select is true by default
                                                             }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }: { field: ControllerRenderProps }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Creatable
                            isMulti={isMulti}
                            options={options}
                            onChange={(selectedOption) => {
                                if (isMulti) {
                                    // MultiValue case: Convert selected options to an array of values
                                    const multiValue = selectedOption as MultiValue<Option>;
                                    field.onChange(
                                        multiValue ? multiValue.map((option) => option.value) : []
                                    );
                                } else {
                                    // SingleValue case: Use the single option's value or fallback to an empty string
                                    const singleValue = selectedOption as SingleValue<Option>;
                                    field.onChange(singleValue?.value || "");
                                }
                            }}
                            onBlur={field.onBlur} // Notify Hook Form about blur events
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage /> {/* Display validation errors */}
                </FormItem>
            )}
        />
    );
};

export default CreatableSelectField;

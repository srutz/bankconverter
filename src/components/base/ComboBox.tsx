import { Check, ChevronsUpDown } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboBoxOption = {
  value: string;
  label: string;
};

export type ComboBoxProps = {
  placeholder?: string;
  disabled?: boolean;
  hideInput?: boolean;
  value?: string;
  options: ComboBoxOption[];
  variant?: "slim" | "normal";
  onChange?: (option: ComboBoxOption) => void;
};

export function ComboBox({
  placeholder = "",
  disabled,
  variant = "normal",
  hideInput,
  value: initialValue,
  options,
  onChange,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className={cn(
            "justify-between flex",
            variant === "slim" ? "w-[200px]" : "w-[300px]",
          )}
        >
          <div className="w-1 grow flex overflow-hidden truncate">
            {value ? (
              options.find((o) => o.value === value)?.label
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command onSelect={() => setOpen(false)} className="overflow-hidden">
          {!hideInput && <CommandInput placeholder="Search options" />}
          <CommandList>
            <CommandEmpty>No options provided.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className=""
                  onSelect={(
                    currentValue: SetStateAction<string | undefined>,
                  ) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    if (onChange) onChange(option);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

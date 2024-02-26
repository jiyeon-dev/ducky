import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useQueryCategories } from "../category/CategoryList";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCategoryProps {
  value: string | undefined;
  setCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  errors?: Record<string, string[] | undefined>;
}

export default function FormCategory({
  value = "",
  setCategory,
  errors,
}: FormCategoryProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useQueryCategories(false);
  const error = errors?.["category"]?.[0] || ""; // 첫번쨰 오류 하나만 노출

  useEffect(() => {
    if (data && !value) {
      setCategory(data[0].id); // 선택된 값이 없는 경우 첫번째 데이터 무조건 선택
    }
  }, [data]);

  return (
    <div className='flex space-x-4'>
      <Label htmlFor='title' className='mt-3 min-w-20 text-center'>
        Category
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              "w-[200px] justify-start",
              error ? "border-red-500" : ""
            )}
            aria-expanded={open}
          >
            {value
              ? data && data.find((item) => item.id === value)?.name
              : data && data[0].name}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {!isLoading &&
                data &&
                data.map((category) => (
                  <CommandItem
                    value={category.name}
                    key={category.id}
                    onSelect={() => {
                      setCategory(category.id);
                      setOpen(false);
                    }}
                  >
                    {category.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        category.id === (value || data[0].id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

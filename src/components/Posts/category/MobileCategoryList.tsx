import { memo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useQueryCategories } from "./CategoryList";
import { Button } from "@/components/ui/button";
import CategoryButtons from "./CategoryButtons";

const MobileCategoryList = memo(() => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { categoryId } = useParams();

  const { data, isLoading } = useQueryCategories();

  const handleChangePage = (url: string) => {
    setOpen(false);
    navigate(url ? `/posts/category/${url}` : `/posts`);
  };

  return (
    <div className='lg:hidden w-full md:px-8 mt-2 grid grid-cols-3 md:mx-auto max-w-3xl'>
      <Popover open={open} onOpenChange={setOpen}>
        <div className='col-start-2'>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start'
              aria-expanded={open}
            >
              {categoryId ? (
                <>{data?.find((item) => item.id === categoryId)?.name}</>
              ) : (
                "ALL"
              )}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            {/* <CommandInput placeholder='Search Category...' className='h-9' /> */}
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {!isLoading &&
                data &&
                data.map((category) => (
                  <CommandItem
                    value={category.name}
                    key={category.id}
                    onSelect={() => handleChangePage(`${category.id}`)}
                  >
                    {category.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        category.id === (categoryId || "")
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

      {/* 설정 */}
      <CategoryButtons />
    </div>
  );
});

export default MobileCategoryList;

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";

interface FormTagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FormTagsInput({ tags, setTags }: FormTagsInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const input = e.target as HTMLInputElement;
    if (e.key === "Backspace" && input.value === "" && tags.length > 0) {
      // 마지막 태그 제거 후 input에 추가
      setTags(() => {
        const copyTags = [...tags];
        input.value = copyTags.splice(-1)[0];
        return [...copyTags];
      });
    } else if (e.key !== "Enter") return;
    else if (e.nativeEvent.isComposing) return;

    e.preventDefault();
    const value = input.value;
    if (!value.trim()) return;
    setTags((prev) => [...prev, value.trim() + ""]);
    input.value = "";
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className='flex space-x-4'>
      <Label htmlFor='tags' className='mt-3 min-w-20 text-center'>
        Tags
      </Label>
      <div className='border-2 p-2 rounded-md flex items-center flex-wrap gap-1 w-full'>
        {tags.map((tag, index) => (
          <Badge className='bg-yellow-500' key={index}>
            {tag}
            <span className='ml-1' onClick={() => removeTag(index)}>
              <XCircle size={18} />
            </span>
          </Badge>
        ))}
        <Input
          onKeyDown={handleKeyDown}
          type='text'
          className='w-auto h-[30px] flex-grow border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none'
          placeholder='Add tag'
        />
      </div>
    </div>
  );
}

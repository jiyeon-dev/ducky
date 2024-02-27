import { ImageIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const CoverImage = ({ url, preview }: CoverImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(url);
  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onRemove = () => {
    setImageUrl(undefined);
    setIsImageChanged(true);
  };

  const onChange = () => {
    if (inputRef.current) {
      inputRef.current.click(); // 이미지 파일 추가 팝업
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = (event.target as HTMLInputElement).files;
    const url =
      files && files.length > 0 ? URL.createObjectURL(files[0]) : undefined;
    if (!url) return;
    setImageUrl(url);
    setIsImageChanged(true);
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group rounded-md",
        !imageUrl && "h-[12vh]",
        imageUrl && "bg-muted"
      )}
    >
      {!!imageUrl && (
        <img
          src={imageUrl}
          alt='Main Image'
          className='object-cover w-full h-[35vh]'
        />
      )}
      {!imageUrl && !preview && (
        <div className='flex justify-center h-full w-full items-center text-gray-400'>
          cover image
        </div>
      )}

      {!preview && (
        <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2'>
          <input
            type='hidden'
            name='isImageChanged'
            value={`${isImageChanged}`} // 이미지 변경 여부 저장
          />
          <input
            ref={inputRef}
            type='file'
            name='mainImageUrl'
            accept='image/*'
            className='invisible'
            onChange={handleImageChange}
          />
          <Button
            type='button'
            onClick={onChange}
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'
          >
            <ImageIcon className='h-4 w-4 mr-2' />
            Change cover
          </Button>
          <Button
            type='button'
            onClick={onRemove}
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'
          >
            <X className='h-4 w-4 mr-2' />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

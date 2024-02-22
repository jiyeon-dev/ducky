import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardFormProps {
  enableEditing: () => void;
}

export const AddCardButton = ({ enableEditing }: CardFormProps) => {
  return (
    <div className='pt-2 px-2'>
      <Button
        onClick={enableEditing}
        className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'
        size='sm'
        variant='ghost'
      >
        <Plus className='h-4 w-4 mr-2' />
        Add a card
      </Button>
    </div>
  );
};

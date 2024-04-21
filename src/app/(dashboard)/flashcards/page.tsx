import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CirclePlus, EllipsisVertical, Pencil, Trash } from 'lucide-react';

export default function FlashcardsPage() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Flashcards</h2>
        <Button>
          <CirclePlus className='mr-2 w-5 h-5 text-white' />
          Add Flashcard
        </Button>
      </div>
      <div className='grid grid-cols-4 gap-3 w-full'>
        {new Array(6).fill(null).map((_, index) => (
          <div key={index} className='border rounded-lg bg-white p-4'>
            <div className='flex gap-2 justify-between'>
              <h3 className='font-semibold'>Name</h3>
              <DropdownMenu>
                <DropdownMenuTrigger className=''>
                  <EllipsisVertical className='w-5 h-5' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Pencil className='w-4 mr-2 h-4' /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash className='mr-2 w-4 h-4' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className='flex justify-between items-center pt-2'>
              <p className='text-sm text-muted-foreground'>Questions: 2</p>
              <Badge>Easy</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

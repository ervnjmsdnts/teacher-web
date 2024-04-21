'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/firebase';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import {
  CirclePlus,
  EllipsisVertical,
  Loader2,
  Pencil,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Quiz = {
  id: string;
  name: string;
  questions: {
    answer: number;
    options: string[];
    questions: string;
  }[];
};

export default function QuizzesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    (() => {
      const unsub = onSnapshot(collection(db, 'quizzes'), (snapshot) => {
        const quizzes = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        });
        setQuizzes(quizzes as Quiz[]);
        setIsLoading(false);
      });

      return () => {
        unsub();
      };
    })();
  }, []);

  const deleteQuiz = async (id: string) => {
    const ref = doc(db, 'quizzes', id);

    try {
      await deleteDoc(ref);
      router.refresh();
      toast({ title: 'Successfully deleted quiz' });
    } catch (_) {
      toast({ title: 'Something went wrong when deleting quiz' });
    }
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quizzes</h2>
        <Button asChild>
          <Link href='/quizzes/add'>
            <CirclePlus className='mr-2 w-5 h-5 text-white' />
            Add Quiz
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className='justify-center items-center flex'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <div className='grid grid-cols-4 gap-3 w-full'>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className='border rounded-lg bg-white p-4'>
              <div className='flex gap-2 justify-between'>
                <h3 className='font-semibold'>{quiz.name}</h3>
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger className=''>
                      <EllipsisVertical className='w-5 h-5' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => router.push(`/quizzes/${quiz.id}`)}>
                        <Pencil className='w-4 mr-2 h-4' /> Edit
                      </DropdownMenuItem>
                      <DialogTrigger className='flex items-center w-full'>
                        <DropdownMenuItem className='w-full'>
                          <Trash className='mr-2 w-4 h-4' />
                          Delete
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        Do you want to delete the quiz? Deleting this quiz
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                      </DialogClose>
                      <Button
                        variant='destructive'
                        onClick={() => deleteQuiz(quiz.id)}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <p className='text-sm text-muted-foreground'>
                Questions: {quiz.questions.length}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

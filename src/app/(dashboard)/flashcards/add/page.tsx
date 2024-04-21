'use client';
import FullPageScroll from '@/components/full-page-scroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  name: z
    .string({ required_error: 'Field is required' })
    .min(1, 'Field is required'),
  questions: z
    .object({
      question: z
        .string({ required_error: 'Question is required' })
        .min(1, 'Field is required'),
      answer: z
        .string({ required_error: 'Answer is required' })
        .min(1, 'Field is required'),
      difficulty: z
        .string({ required_error: 'Difficulty is required' })
        .min(1, 'Difficulty is required'),
    })
    .array()
    .min(1),
});

type Schema = z.infer<typeof schema>;

export default function AddFlashcardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      questions: [{ question: '', answer: '', difficulty: 'easy' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const { toast } = useToast();

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true);
      await addDoc(collection(db, 'flashcards'), data);
      form.reset({
        name: '',
        questions: [{ answer: '', difficulty: 'easy', question: '' }],
      });
      toast({ title: 'Successfully Added Flashcard' });
      router.back();
    } catch (_) {
      toast({
        title: 'Something went wrong adding flashcard',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCard = () => {
    append({ answer: '', question: '', difficulty: 'easy' });
    form.trigger('questions');
  };

  return (
    <div className='flex flex-col h-full gap-4'>
      <div className='flex gap-2 items-center'>
        <Button size='icon' variant='ghost' onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h2 className='text-2xl font-bold'>Add Flashcard</h2>
      </div>
      <FullPageScroll>
        <div className='flex flex-col px-2 max-w-md gap-4'>
          <div className='grid gap-1.5 relative'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' {...form.register('name')} />
            <span className='text-destructive text-sm'>
              {form.formState.errors.name?.message}
            </span>
          </div>
          {fields.map((item, index) => (
            <div key={item.id}>
              <div className='flex items-center justify-between pb-4 gap-2'>
                <p className='font-semibold'>Card {index + 1}</p>
                {fields.length > 1 && (
                  <Button
                    type='button'
                    onClick={() => remove(index)}
                    size='icon'
                    className='p-0 h-6 w-6'
                    variant='destructive'>
                    <X className='w-4 h-4' />
                  </Button>
                )}
              </div>
              <div className='grid gap-4'>
                <div className='grid gap-1.5'>
                  <Label htmlFor={`question-${index}`}>Question</Label>
                  <Input
                    id={`question-${index}`}
                    {...form.register(`questions.${index}.question`)}
                  />
                  <span className='text-destructive text-sm'>
                    {
                      form.formState.errors.questions?.[index]?.question
                        ?.message
                    }
                  </span>
                </div>
                <div className='grid gap-1.5'>
                  <Label htmlFor={`answer-${index}`}>Answer</Label>
                  <Input
                    id={`answer-${index}`}
                    {...form.register(`questions.${index}.answer`)}
                  />
                  <span className='text-destructive text-sm'>
                    {form.formState.errors.questions?.[index]?.answer?.message}
                  </span>
                </div>
                <div className='grid gap-1.5'>
                  <Label htmlFor={`difficulty-${index}`}>Difficulty</Label>
                  <Controller
                    control={form.control}
                    name={`questions.${index}.difficulty`}
                    render={({ field }) => (
                      <div className='grid gap-1.5'>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='easy'>Easy</SelectItem>
                            <SelectItem value='medium'>Medium</SelectItem>
                            <SelectItem value='hard'>Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className='text-destructive text-sm'>
                          {
                            form.formState.errors.questions?.[index]?.difficulty
                              ?.message
                          }
                        </span>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className='items-center flex justify-between'>
            <Button type='button' variant='outline' onClick={addCard}>
              Add Question
              <Plus className='w-4 h-4 ml-2' />
            </Button>
            <Button
              disabled={isLoading}
              onClick={form.handleSubmit(onSubmit)}
              type='submit'>
              {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}{' '}
              Submit
            </Button>
          </div>
        </div>
      </FullPageScroll>
    </div>
  );
}

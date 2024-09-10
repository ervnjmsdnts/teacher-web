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
import { useParams, useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const schema = z.object({
  name: z
    .string({ required_error: 'Field is required' })
    .min(1, 'Field is required'),
  type: z
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
    })
    .array()
    .min(1),
});

type Schema = z.infer<typeof schema>;

type Flashcards = {
  id: string;
  name: string;
  type: string;
  questions: {
    question: string;
    answer: string;
  }[];
};

export default function UpdateFlashcardPage() {
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcards>(
    {} as Flashcards,
  );
  const router = useRouter();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      type: '',
      questions: [{ question: '', answer: '' }],
    },
  });

  useEffect(() => {
    (async () => {
      const docs = await getDoc(doc(db, 'flashcards', params.id));

      if (docs.exists()) {
        const data = docs.data() as Flashcards;
        setCurrentFlashcard(data);
        form.reset({
          name: data.name,
          type: data.type,
          questions: data.questions,
        });
      }
    })();
  }, [params.id, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const { toast } = useToast();

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'flashcards', params.id), data);
      toast({ title: 'Successfully updated Flashcard' });
      router.back();
    } catch (_) {
      toast({
        title: 'Something went wrong updating flashcard',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCard = () => {
    append({ answer: '', question: '' });
    form.trigger('questions');
  };

  return (
    <div className='flex flex-col h-full gap-4'>
      <div className='flex gap-2 items-center'>
        <Button size='icon' variant='ghost' onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h2 className='text-2xl font-bold'>
          Update Flashcard ({currentFlashcard.name})
        </h2>
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
          <div className='grid gap-1.5'>
            <Label htmlFor='type'>Type</Label>
            <Controller
              control={form.control}
              name='type'
              render={({ field }) => (
                <div className='grid gap-1.5'>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='english'>English</SelectItem>
                      <SelectItem value='math'>Math</SelectItem>
                      <SelectItem value='science'>Science</SelectItem>
                      <SelectItem value='socialScience'>
                        Social Science
                      </SelectItem>
                      <SelectItem value='filipino'>Filipino</SelectItem>
                      <SelectItem value='professionalEducation'>
                        Professional Education
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <span className='text-destructive text-sm'>
                    {form.formState.errors.type?.message}
                  </span>
                </div>
              )}
            />
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
              Update
            </Button>
          </div>
        </div>
      </FullPageScroll>
    </div>
  );
}

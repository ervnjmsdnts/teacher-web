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
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
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
      options: z
        .array(
          z
            .string({ required_error: 'Options is required' })
            .min(1, 'Field is required'),
        )
        .min(4, 'Field requires 4 options'),
      answer: z
        .string({ required_error: 'Answer is required' })
        .min(1, 'Field is required'),
    })
    .array()
    .min(1),
});

type Schema = z.infer<typeof schema>;

type Quiz = {
  id: string;
  name: string;
  questions: {
    answer: number;
    options: string[];
    questions: string;
  }[];
};

export default function UpdateQuizPage() {
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>({} as Quiz);
  const router = useRouter();
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      questions: [{ question: '', answer: '0', options: ['', '', '', ''] }],
    },
  });

  useEffect(() => {
    (async () => {
      const docs = await getDoc(doc(db, 'quizzes', params.id));

      if (docs.exists()) {
        const data = docs.data() as Quiz;
        setCurrentQuiz(data);
        form.reset({
          name: data.name,
          questions: data.questions.map((q) => ({
            ...q,
            answer: String(q.answer),
          })),
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
      await updateDoc(doc(db, 'quizzes', params.id), {
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          answer: Number(q.answer),
        })),
      });
      form.reset({
        name: '',
        questions: [{ answer: '0', question: '', options: ['', '', '', ''] }],
      });
      toast({ title: 'Successfully updated quiz' });
      router.back();
    } catch (_) {
      toast({
        title: 'Something went wrong updating quiz',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    append({ answer: '0', question: '', options: ['', '', '', ''] });
    form.trigger('questions');
  };

  return (
    <div className='flex flex-col h-full gap-4'>
      <div className='flex gap-2 items-center'>
        <Button size='icon' variant='ghost' onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h2 className='text-2xl font-bold'>Update Quiz ({currentQuiz.name})</h2>
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
                <p className='font-semibold'>Question {index + 1}</p>
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
                {/* Options */}
                <div className='grid gap-1.5'>
                  <div className='grid gap-1.5'>
                    <Label htmlFor={`options-${index}-0`}>Option 1</Label>
                    <Input
                      id={`options-${index}-0`}
                      {...form.register(`questions.${index}.options.0`)}
                    />
                    <span className='text-destructive text-sm'>
                      {
                        form.formState.errors.questions?.[index]?.options?.[0]
                          ?.message
                      }
                    </span>
                  </div>
                  <div className='grid gap-1.5'>
                    <Label htmlFor={`options-${index}-1`}>Option 2</Label>
                    <Input
                      id={`options-${index}-1`}
                      {...form.register(`questions.${index}.options.1`)}
                    />
                    <span className='text-destructive text-sm'>
                      {
                        form.formState.errors.questions?.[index]?.options?.[1]
                          ?.message
                      }
                    </span>
                  </div>
                  <div className='grid gap-1.5'>
                    <Label htmlFor={`options-${index}-2`}>Option 3</Label>
                    <Input
                      id={`options-${index}-2`}
                      {...form.register(`questions.${index}.options.2`)}
                    />
                    <span className='text-destructive text-sm'>
                      {
                        form.formState.errors.questions?.[index]?.options?.[2]
                          ?.message
                      }
                    </span>
                  </div>
                  <div className='grid gap-1.5'>
                    <Label htmlFor={`options-${index}-3`}>Option 4</Label>
                    <Input
                      id={`options-${index}-3`}
                      {...form.register(`questions.${index}.options.3`)}
                    />
                    <span className='text-destructive text-sm'>
                      {
                        form.formState.errors.questions?.[index]?.options?.[3]
                          ?.message
                      }
                    </span>
                  </div>
                </div>
                <div className='grid gap-1.5'>
                  <Label htmlFor={`answer-${index}`}>Answer</Label>
                  <Controller
                    control={form.control}
                    name={`questions.${index}.answer`}
                    render={({ field }) => (
                      <div className='grid gap-1.5'>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='0'>1st Option</SelectItem>
                            <SelectItem value='1'>2nd Option</SelectItem>
                            <SelectItem value='2'>3rd Option</SelectItem>
                            <SelectItem value='3'>4th Option</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className='text-destructive text-sm'>
                          {
                            form.formState.errors.questions?.[index]?.answer
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
            <Button type='button' variant='outline' onClick={addQuestion}>
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

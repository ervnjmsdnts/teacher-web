'use client';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, NotebookPen, WalletCards } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className='min-w-80 p-4'>
      <nav className='bg-white flex flex-col h-full rounded-lg p-4 border'>
        <div className='flex-grow'>
          <h1 className='text-xl font-semibold pb-6 text-center text-primary'>
            TEACHER
          </h1>
          <div className='flex flex-col gap-2'>
            <Button
              asChild
              className='justify-start'
              variant={pathname.includes('/flashcards') ? 'default' : 'ghost'}>
              <Link href='/flashcards'>
                <WalletCards className='mr-2 h-5 w-5' />
                Flashcards
              </Link>
            </Button>
            <Button
              asChild
              className='justify-start'
              variant={pathname.includes('/quizzes') ? 'default' : 'ghost'}>
              <Link href='/quizzes'>
                <NotebookPen className='mr-2 h-5 w-5' />
                Quizzes
              </Link>
            </Button>
          </div>
        </div>
        <Button className='justify-start' variant='secondary'>
          <LogOut className='mr-2 h-5 w-5' />
          Log out
        </Button>
      </nav>
    </div>
  );
}

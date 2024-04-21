import Sidebar from '@/components/side-bar';
import { PropsWithChildren } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className='h-full bg-gray-100 w-full flex'>
      <Sidebar />
      <main className='w-full p-4 pt-8'>{children}</main>
    </div>
  );
}

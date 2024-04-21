import { PropsWithChildren } from 'react';

export default function FullPageScroll({ children }: PropsWithChildren) {
  return <div className='flex-grow h-0 overflow-y-auto'>{children}</div>;
}

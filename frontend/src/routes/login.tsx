import LoginForm from '@/components/LoginForm'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const searchSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const search = Route.useSearch();
  
  useEffect(() => {
    if (search.error) {
      toast.error(decodeURIComponent(search.error));
    }
  }, [search]);

  return (
    <div className='flex flex-row items-center justify-center'>
      <div className="flex gap-4 lg:min-h-svh lg:max-w-1/2 flex-row lg:items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
        <div className="block hidden lg:block bg-blue-300 w-full max-w-sm md:max-w-3xl">
          <img src="https://placehold.co/600x400" alt="Placeholder image" />
        </div>
      </div>
    </div>
  )
}

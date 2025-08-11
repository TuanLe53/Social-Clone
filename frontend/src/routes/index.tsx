import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='flex flex-row items-center justify-center'>
      {isAuthenticated
        ? 
        <h1>Placeholder</h1>      
        :
        <div className="flex gap-4 lg:min-h-svh lg:max-w-1/2 flex-row lg:items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm />
          </div>
          <div className="block hidden lg:block bg-blue-300 w-full max-w-sm md:max-w-3xl">
            <img src="https://placehold.co/600x400" alt="Placeholder image" />
          </div>
        </div>
      }
    </div>
  )
}

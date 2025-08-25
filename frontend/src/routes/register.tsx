import { register } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters long'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const searchSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute('/register')({
    component: RouteComponent,
    validateSearch: searchSchema,
});

function RouteComponent() {
    const navigate = useNavigate();
    const search = Route.useSearch();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await register(data)
            navigate({ to: '/login' })
            toast.success('Registration successful! Please log in.');
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'An error occurred';
            form.setError('root', { message: errorMessage });
        }
    }

    const handleGithubRegister = async () => {
        window.location.href = 'http://localhost:8000/auth/register/github';
    }

    useEffect(() => {
        if (search.error) {
            toast.error(decodeURIComponent(search.error));
        }
    }, [search]);

    return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
                <div className='mt-20'>
                    <h1 className="text-center text-4xl tracking-tight text-balance mb-6">Social</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem className="mb-2">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='username'   
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'   
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='confirmPassword'   
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder="Confirm your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {form.formState.errors.root && (
                                <div className="flex items-start gap-2 p-3 mb-4 border border-red-300 rounded-md bg-red-50 text-red-700">
                                    <CircleAlert className="mt-1 h-5 w-5 text-red-500" />
                                    <p className="text-sm font-medium">
                                        {form.formState.errors.root.message}
                                    </p>
                                </div>
                            )}

                            <Button type="submit" className="w-full mb-4">Submit</Button>
                        </form>
                    </Form>
                    <div className="mb-4 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            Or continue with
                        </span>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleGithubRegister}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                fill="currentColor"
                            />
                        </svg>
                        Register with GitHub
                    </Button>
                </div>
        </div>
    </div>
    )
}

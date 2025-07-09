import { login } from "@/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export default function LoginForm() {
    const navigate = useNavigate();

    const { handleLogin } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: '',
        password: '',
    }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {    
    try {
        const response = await login(values)
        handleLogin(response.data.access_token)
        navigate({to: '/'})
    } catch (error: any){
        const errorMessage = error.response?.data?.detail || 'An error occurred';
        form.setError('root', { message: errorMessage });
    }
    }

    return (
    <div>
        <h1>Login</h1>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type='email' placeholder="Enter your email" {...field} />
                </FormControl>
                <FormDescription>
                    Please enter a valid email address.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type='password' placeholder="Enter your password" {...field} />
                </FormControl>
                <FormDescription>
                    Your password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            {form.formState.errors.root && (
            <p>
                {form.formState.errors.root.message}
            </p>
            )}

            <Button type="submit">Submit</Button>
        </form>
        </Form>
    </div>
  )
}
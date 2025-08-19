import { privateAPI, publicAPI } from ".";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const login = (form: z.infer<typeof formSchema>) => publicAPI.post('/auth/login', form);
export const refreshToken = () => privateAPI.post('/auth/refresh');

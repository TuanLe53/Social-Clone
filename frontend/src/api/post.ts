import { privateAPI } from ".";

export const createPost = (post: FormData) => privateAPI.post('/post', post, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
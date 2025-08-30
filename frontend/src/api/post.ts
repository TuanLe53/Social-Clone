import { privateAPI, publicAPI } from ".";

export const createPost = (post: FormData) => privateAPI.post('/post', post, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const getPostsByUser = (user_id: string) => publicAPI.get(`/post/user/${user_id}`);
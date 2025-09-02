import { privateAPI, publicAPI } from ".";

export const createPost = (post: FormData) => privateAPI.post('/post', post, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const getPostsByUser = (user_id: string) => publicAPI.get(`/post/user/${user_id}`);
export const likePost = (post_id: string) => privateAPI.post(`/post/like/${post_id}`);
export const unlikePost = (post_id: string) => privateAPI.delete(`/post/like/${post_id}`);
export const isPostLiked = (post_id: string) => privateAPI.get(`/post/is_liked/${post_id}`);
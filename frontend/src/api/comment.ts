import { z } from "zod";
import { privateAPI } from ".";

const commentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment cannot exceed 500 characters'),
    postId: z.string().uuid('Invalid post ID'),
    parentId: z.string().uuid('Invalid parent comment ID').optional().nullable(),
});

export const postComment = (comment: z.infer<typeof commentSchema>) => privateAPI.post('/comment', comment);
export const getComments = (postId: string) => privateAPI.get(`/comment/post/${postId}`);
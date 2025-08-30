import { getPostsByUser } from "@/api/post";
import type { Post } from "@/types/post";
import { useEffect, useState } from "react"

interface PostsProps{
    user_id: string;
}

export default function Posts({user_id}: PostsProps) {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getPostsByUser(user_id);
                setPosts(res.data)
            } catch (error: any) {
                const errorMessage = error.response?.data?.detail || 'An error occurred';
                console.log(errorMessage)
            }
        }

        fetchPosts();
    }, [user_id]);
    

    return (
        <div>
            Posts
        </div>
    )
}
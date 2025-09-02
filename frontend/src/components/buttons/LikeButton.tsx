import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { isPostLiked, likePost, unlikePost } from "@/api/post";

interface LikeButtonProps {
    postId: string
}

export default function LikeButton({postId}: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleClick = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (isLiked) {
                await unlikePost(postId);
                setIsLiked(false);
            } else {
                await likePost(postId);
                setIsLiked(true);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'An error occurred';
            console.log(errorMessage);
        }finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const res = await isPostLiked(postId);
                setIsLiked(res.data.is_liked)
            } catch (error: any) {
                const errorMessage = error.response?.data?.detail || 'An error occurred';
                console.log(errorMessage);
            }
        }

        checkIfLiked();
    }, [postId])

    return (
        <Heart
            role="button"
            aria-label={isLiked ? "Unlike post" : "Like post"}
            className={`hover:cursor-pointer ${isLiked && 'text-red-500 fill-red-500' }`}
            onClick={handleClick}
        />
    );
}
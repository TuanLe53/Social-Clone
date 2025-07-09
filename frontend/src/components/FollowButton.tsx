import { followUser, isFollowingUser, unfollowUser } from "@/api/user";
import { Button } from "./ui/button";
import type { UserProfile } from "@/types/user";
import { useEffect, useState } from "react";

interface FollowButtonProps {
    user: UserProfile
}
export default function FollowButton({user}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        
        try {
            if (isFollowing) {
                await unfollowUser(user.id);
                setIsFollowing(false);
            } else {
                await followUser(user.id);
                setIsFollowing(true);
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'An error occurred';
            console.log(errorMessage);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                const res = await isFollowingUser(user.id);
                setIsFollowing(res.data.is_following);
            } catch (error: any) {
                const errorMessage = error.response?.data?.detail || 'An error occurred';
                console.log(errorMessage);
            }
        }

        checkFollowingStatus();
    }, [user.id]);

    return (
        <Button type="button" onClick={handleClick} disabled={isLoading}>
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    )
}
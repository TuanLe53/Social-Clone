import type { UserProfile } from "@/types/user";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CircleUserRound } from "lucide-react";

interface UserCardProps{
    user: UserProfile
}

export default function UserCard({user}: UserCardProps) {
    
    return (
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Avatar>
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>
                    <CircleUserRound />
                </AvatarFallback>
            </Avatar>
            <Link to="/profile/$username" params={{username: user.username}}>
                <p>{user.username}</p>
            </Link>
        </div>
    )
}
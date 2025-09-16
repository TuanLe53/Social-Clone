import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CircleUserRound } from "lucide-react";
import type { UserProfile } from "@/types/user";

interface UserAvatarLinkProps{
    user: UserProfile
}

export default function UserAvatarLink({user}: UserAvatarLinkProps) {
    
    return (
        <Link to="/profile/$username" params={{username: user.username}} className="flex items-center gap-2 p-2">
            <Avatar>
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback>
                    <CircleUserRound />
                </AvatarFallback>
            </Avatar>
            <div>
                <p>{user.username}</p>
            </div>
        </Link>
    )
}
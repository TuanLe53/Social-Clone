import type { UserProfile } from "@/types/user";
import { Link } from "@tanstack/react-router";

interface UserCardProps{
    user: UserProfile
}

export default function UserCard({user}: UserCardProps) {
    
    return (
        <div>
            <Link to="/profile/$username" params={{username: user.username}}>
                <p>{user.username}</p>
            </Link>
        </div>
    )
}
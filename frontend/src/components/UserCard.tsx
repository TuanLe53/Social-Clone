import type { UserProfile } from "@/types/user";
import UserAvatarLink from "./UserAvatarLink";

interface UserCardProps{
    user: UserProfile
}

export default function UserCard({user}: UserCardProps) {
    
    return (
        <div className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <UserAvatarLink user={user} />
        </div>
    )
}
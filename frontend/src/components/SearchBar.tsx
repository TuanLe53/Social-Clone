import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "@/lib/hooks";
import { searchUsers } from "@/api/user";
import UserCard from "./UserCard";
import type { UserProfile } from "@/types/user";

export default function SearchBar() {
    const [username, setUsername] = useState<string>("");
    const debouncedSearch = useDebounce(username);
    const [users, setUsers] = useState<UserProfile[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (debouncedSearch) {                
                try {
                    const res = await searchUsers(debouncedSearch);
                    setUsers(res.data);                
                } catch (error: any) {
                    const errorMessage = error.response?.data?.detail || 'An error occurred';
                    console.log(errorMessage);
                }
            } else {
                setUsers([]);
            }
        }

        fetchUsers();
    }, [debouncedSearch])
    
    return (
        <div>
            <Input value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
            {users.length === 0 ?
                <p className="text-center text-muted-foreground text-sm mt-4">No users found</p>
                :
                users.map((user) => (
                    <UserCard user={user} key={user.id}/>
                ))
            }
        </div>
    )
}
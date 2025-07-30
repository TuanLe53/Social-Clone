import { useEffect, useState } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { UserProfile } from "@/types/user";
import { getFollowers, getFollowings } from "@/api/user";
import UserCard from "./UserCard";

interface FollowListProps{
    user_id: string;
    selectedTab: string;
    onTabChange: (tab: string) => void;
}

export default function FollowList({ selectedTab, user_id, onTabChange }: FollowListProps) {    
    const [followers, setFollowers] = useState<UserProfile[]>([]);
    const [followings, setFollowings] = useState<UserProfile[]>([]);

    let dialogTitle = selectedTab === "followers" ? "Followers" : "Followings";

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                let res;
                if (selectedTab === 'followers') {
                    res = await getFollowers(user_id);
                    setFollowers(res.data);
                } else {
                    res = await getFollowings(user_id);
                    setFollowings(res.data);
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.detail || 'An error occurred';
                console.log(errorMessage)
            }
        }

        fetchUserList();
    }, [selectedTab]);


    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription>128 something</DialogDescription>
            </DialogHeader>
            <Tabs value={selectedTab} onValueChange={onTabChange}>
                <TabsList>
                    <TabsTrigger value="followers">Followers</TabsTrigger>
                    <TabsTrigger value="followings">Followings</TabsTrigger>
                </TabsList>
                <TabsContent value="followers">
                    {followers.length > 0 ?
                        followers.map((user) => (
                            <UserCard key={user.id} user={user}/>
                        ))
                        :
                        <p>No followers found.</p>
                }
                </TabsContent>
                <TabsContent value="followings">
                    {followings.length > 0 ?
                        followings.map((user) => (
                            <UserCard key={user.id} user={user}/>
                        ))
                        :
                        <p>No followings found.</p>
                }
                </TabsContent>
            </Tabs>
        </DialogContent>
    )
}
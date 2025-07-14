import { getProfile } from '@/api/user';
import FollowButton from '@/components/FollowButton';
import FollowList from '@/components/FollowList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/profile/$username')({
    component: RouteComponent,
    loader: async ({ params }) => {
        const { username } = params;
        if (!username) {
            throw new Error('Username is required');
        }
        try {
            const res = await getProfile(username);
            return { user: res.data, error: null };
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'An error occurred';
            if (error.response?.status === 404) {
                return { user: null, error: 'User not found.' };
            }
            return { user: null, error: errorMessage };
        }
    }
})

function RouteComponent() {
    const { isAuthenticated } = useAuth();
    const { user, error } = Route.useLoaderData();
    console.log(user);
    const [selectedTab, setSelectedTab] = useState<'followers' | 'followings'>('followers');
    const handleTabChange = (tab: 'followers' | 'followings') => {
        setSelectedTab(tab);
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>{user.name || user.username}'s Profile</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button type='button' onClick={() => handleTabChange('followers')}>128 followers</Button>
                </DialogTrigger>

                <DialogTrigger asChild>
                    <Button type='button' onClick={() => handleTabChange('followings')}>125 followings</Button>
                </DialogTrigger>

                <FollowList selectedTab={selectedTab} user_id={user.id} />
            </Dialog>
            {isAuthenticated && <FollowButton user={user}/>}
            
        </div>
    )
}

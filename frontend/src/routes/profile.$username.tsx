import { getProfile } from '@/api/user';
import FollowButton from '@/components/buttons/FollowButton';
import FollowList from '@/components/FollowList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth';
import type { UserProfile } from '@/types/user';
import { createFileRoute } from '@tanstack/react-router'
import { UserRound } from 'lucide-react';
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
            return { user: res.data as UserProfile, error: null };
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
    const { isAuthenticated, currentUser } = useAuth();
    const { user, error } = Route.useLoaderData();

    // const [activeTab, setActiveTab] = useState<string>('followers');

    // const handleTabChange = (tab: string) => {
    //     setActiveTab(tab);
    // }

    if (error) {
        return (
            <div>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className='p-5 bg-red-300 min-h-svh w-svh'>
            <div className='flex gap-5'>
                <Avatar className='w-20 h-20'>
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback>
                        <UserRound className='w-full h-full' />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className='text-xl mb-4'>{user?.username}</p>
                    {/* <Dialog>
                        <DialogTrigger asChild>
                            <Button type='button' onClick={() => handleTabChange('followers')}>128 followers</Button>
                        </DialogTrigger>

                        <DialogTrigger asChild>
                            <Button type='button' onClick={() => handleTabChange('followings')}>125 followings</Button>
                        </DialogTrigger>

                        <FollowList selectedTab={activeTab} onTabChange={handleTabChange} user_id={user?.id} />
                    </Dialog> */}
                    {isAuthenticated &&
                        <div className='flex gap-2'>
                            <Button>Message</Button>
                            <FollowButton user={user} />
                        </div>
                    }
                </div>
            </div>            
        </div>
    )
}

import { getProfile } from '@/api/user';
import FollowButton from '@/components/FollowButton';
import { useAuth } from '@/contexts/auth';
import { createFileRoute } from '@tanstack/react-router'

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
            {isAuthenticated && <FollowButton user={user}/>}
            
        </div>
    )
}

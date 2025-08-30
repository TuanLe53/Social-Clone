import type { UserProfile } from "./user";

export interface Post{
    id: string;
    content: string;

    like_count: number;
    comment_count: number;
    share_count: number;

    creator: UserProfile;
    created_at: string;

    images: PostImage[];
}

export interface PostImage{
    id: string;
    post_id: string;
    image_url: string;
}
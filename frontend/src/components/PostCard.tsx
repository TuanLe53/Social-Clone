import type { Post } from "@/types/post"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Heart, MessageCircle } from "lucide-react";

interface PostCardProps {
    post: Post;
}

export default function PostCard({post}: PostCardProps) {
    console.log(post)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="md:w-[300px] w-[160px] bg-black/80 relative">
                    <img src={post.images[0].image_url} alt={`Post: ${post.id}`} className="w-full h-full object-contain aspect-[3/4] " />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center hover:cursor-pointer bg-black/70 opacity-0 hover:opacity-100 text-white gap-5">
                        <div className="flex items-center gap-1">
                            <Heart fill="white"/>
                            <span>{post.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle fill="white"/>
                            <span>{post.comment_count}</span>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent>
                <div>
                    <p>{post.content}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
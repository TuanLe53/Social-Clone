import type { Post } from "@/types/post"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import LikeButton from "./buttons/LikeButton";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";
import AddComment from "./AddComment";
import type { UserProfile } from "@/types/user";
import UserAvatarLink from "./UserAvatarLink";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const { isAuthenticated } = useAuth();
    
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="md:w-[300px] w-[160px] bg-black/80 relative">
                    <img src={post.images[0].image_url} alt={`Post: ${post.id}`} className="w-full h-full object-contain aspect-[3/4]" />
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

            <DialogContent className="w-[70%]" showCloseButton={false}>
                <PostCardHeader user={post.creator} />

                <div className="w-full">
                    <Carousel>
                        <CarouselContent>
                            {post.images.map((image, index) => (
                                <CarouselItem key={index} className="flex justify-center">
                                    <img src={image.image_url} alt={`Post: ${post.id}`} className="w-full h-full object-contain aspect-[4/5]" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                {isAuthenticated &&                
                    <DialogFooter>
                        <AddComment isOpen={isOpen} postId={post.id} />
                        <div className="flex gap-4 items-center">
                            <LikeButton postId={post.id} />
                            <MessageCircle className="hover:cursor-pointer" onClick={toggleOpen}/>
                            <Send className="hover:cursor-pointer"/>
                        </div>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}

interface PostCardHeaderProps { 
    user: UserProfile;
}

function PostCardHeader({ user }: PostCardHeaderProps) {
    
    return (
        <DialogHeader>
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <UserAvatarLink user={user} />

                    <div>
                        <Ellipsis />
                    </div>

                </div>
            </DialogTitle>
        </DialogHeader>
    )
}
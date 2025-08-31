import type { Post } from "@/types/post"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CircleUserRound, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {

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

            <DialogContent className="w-[70%]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 p-2 rounded-md">
                                <Avatar>
                                    <AvatarImage src={post.creator.avatar_url} />
                                    <AvatarFallback>
                                        <CircleUserRound />
                                    </AvatarFallback>
                                </Avatar>
                                <p>{post.creator.username}</p>
                            </div>

                            <div>
                                <Ellipsis />
                            </div>

                        </div>
                    </DialogTitle>
                </DialogHeader>

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

                <DialogFooter>
                    <div className="flex gap-4 items-center">
                        <Heart className="hover:cursor-pointer"/>
                        <MessageCircle className="hover:cursor-pointer"/>
                        <Send className="hover:cursor-pointer"/>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
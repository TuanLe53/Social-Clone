import type { Post, PostImage } from "@/types/post"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import LikeButton from "./buttons/LikeButton";
import { useAuth } from "@/contexts/auth";
import { useEffect, useState } from "react";
import AddComment from "./AddComment";
import type { UserProfile } from "@/types/user";
import UserAvatarLink from "./UserAvatarLink";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { getComments } from "@/api/comment";
import type { Comment } from "@/types/comment";
import { formatDistanceToNow, parseISO} from "date-fns";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const { isAuthenticated } = useAuth();
    
    const width = useWindowWidth();
    const isMobile = width <= 768;

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

            <DialogContent className="w-[70%] max-h-[90vh] md:min-w-3/4 md:flex md:p-0 md:min-h-[90vh]" showCloseButton={false}>
                
            
                {isMobile ?
                    <>
                        <PostCardHeader user={post.creator} />
                        <PostCardImageCarousel images={post.images} />
                        {isAuthenticated &&
                            <PostCardFooter postId={post.id} />
                        }
                    </>
                    :
                    <>
                        <div className="w-1/2">
                            <PostCardImageCarousel images={post.images} />
                        </div>
                        <div className="w-1/2 p-4">
                            <PostCardHeader user={post.creator} />
                            <PostCardComments postId={post.id} />
                            {isAuthenticated &&
                                <PostCardFooter postId={post.id} />
                            }
                        </div>
                    </>
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

interface PostCardImageCarouselProps {
    images: PostImage[];
}

function PostCardImageCarousel({ images }: PostCardImageCarouselProps) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Carousel className="w-full h-full flex items-center justify-center">
                <CarouselContent className="h-full"> 
                    {images.map((image, index) => (
                        <CarouselItem key={index} className="flex justify-center items-center h-full">
                            <img
                                src={image.image_url}
                                alt={`Post: ${image.post_id}`}
                                className="max-w-full max-h-full object-contain aspect-[4/5] md:aspect-auto"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

interface PostCardFooterProps {
    postId: string;
}

function PostCardFooter({postId}: PostCardFooterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <DialogFooter>
            <AddComment isOpen={isOpen} postId={postId} />
            <div className="flex gap-4 items-center">
                <LikeButton postId={postId} />
                <MessageCircle className="hover:cursor-pointer" onClick={toggleOpen}/>
                <Send className="hover:cursor-pointer"/>
            </div>
        </DialogFooter>
    )
}

interface PostCardCommentsProps {
    postId: string;
}

function PostCardComments({postId}: PostCardCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await getComments(postId);
                setComments(res.data);
            } catch (error: any) {
                const errorMessage = error.response?.data?.detail || 'An error occurred';
                console.log(errorMessage)
            }
        }

        fetchComments()
    }, [postId]);

    return (
        <div className="h-4/5 p-4">
            {comments.length === 0 ?
                <p>No comments</p>
                :
                comments.map((comment) => (
                    <PostComment key={comment.id} comment={comment} />
                ))
        }
        </div>
    )
}

interface PostCommentProps {
    comment: Comment;
}

function PostComment({ comment }: PostCommentProps) {
    const timeAgo = formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true });

    return (
        <div>
            <UserAvatarLink user={comment.user} />
            <div className="pl-2">
                <p>{comment.content}</p>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{timeAgo}</span>
                    <span className="text-xs text-gray-500">Reply</span>
                </div>
            </div>
        </div>
    )
}
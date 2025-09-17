import { Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from "./ui/emoji-picker";
import { Textarea } from "./ui/textarea";
import { postComment } from "@/api/comment";
import { toast } from "sonner";

interface AddCommentProps {
    isOpen: boolean;
    postId: string;
    parentId?: string;
}

export default function AddComment({ isOpen, postId, parentId }: AddCommentProps) {
    const [openEmojiPicker, setIsOpenEmojiPicker] = useState(false);
    const [comment, setComment] = useState("");

    const onEmojiSelect = (emoji: string) => {
        setComment((prev) => prev + emoji)
        setIsOpenEmojiPicker(false)
    }

    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    const handleClick = async () => {
        const commentData = {
            content: comment,
            postId,
            parentId: parentId || null,
        }
        // console.log("Posting comment:", commentData);

        try {
            await postComment(commentData);
            toast.success("Comment posted successfully!");
            setComment(""); // Clear the comment input after posting
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "An error occurred";
            console.error("Error creating post:", errorMessage);
        }

    }
    
    return (
        <div className={`flex items-center ${isOpen ? "" : "hidden"}`}>
            <Popover onOpenChange={setIsOpenEmojiPicker} open={openEmojiPicker}>
                <PopoverTrigger asChild>
                    <Button variant="link" className="hover:cursor-pointer">
                        <Smile />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <EmojiPicker
                        className="h-[342px]"
                        onEmojiSelect={({ emoji }) => onEmojiSelect(emoji)}
                    >
                        <EmojiPickerSearch />
                        <EmojiPickerContent />
                        <EmojiPickerFooter />
                    </EmojiPicker>

                </PopoverContent>
            </Popover>
            <Textarea onChange={onCommentChange} value={comment} placeholder="Add a comment..." className="max-h-24 border-0 ring-0 focus-visible:ring-0 shadow-none resize-none" />
            <Button disabled={comment.length === 0} onClick={handleClick} variant="link">Post</Button>
        </div>
    )
}
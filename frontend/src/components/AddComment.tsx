import { Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from "./ui/emoji-picker";
import { Textarea } from "./ui/textarea";

interface AddCommentProps {
    isOpen: boolean;
}

export default function AddComment({ isOpen }: AddCommentProps) {
    const [openEmojiPicker, setIsOpenEmojiPicker] = useState(false);
    const [comment, setComment] = useState("");

    const onEmojiSelect = (emoji: string) => {
        setComment((prev) => prev + emoji)
        setIsOpenEmojiPicker(false)
    }

    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    const postComment = async () => {
        console.log("Posting comment:", comment);
        // Here you would typically make an API call to post the comment
        // For example:
        // await api.post('/comments', { content: comment });
        setComment(""); // Clear the comment input after posting
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
            <Button onClick={postComment} variant="link">Post</Button>
        </div>
    )
}
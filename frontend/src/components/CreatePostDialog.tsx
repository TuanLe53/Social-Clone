import { CirclePlus, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useSidebar } from "./ui/sidebar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, type ChangeEvent } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createPost } from "@/api/post";
import { toast } from "sonner";

export default function CreatePostDialog() {
    const { open } = useSidebar();

    const [content, setContent] = useState<string>("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);

            const urls = fileArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        const newUrls = previewUrls.filter((_, index) => index !== indexToRemove);

        URL.revokeObjectURL(previewUrls[indexToRemove]);

        setSelectedFiles(newFiles);
        setPreviewUrls(newUrls);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        
        // Append content field first
        formData.append("content", content);
        
        // Append each file to the 'photos' field
        // It's crucial to append each file individually, with the same key
        selectedFiles.forEach(file => {
            formData.append("photos", file);
        });

        try {
            const res = await createPost(formData);
            // console.log("Post created successfully:", res.data);
            toast.success("Post created successfully!");

            setSelectedFiles([]);
            setPreviewUrls([]);
            setContent("");
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || "An error occurred";
            console.error("Error creating post:", errorMessage);
        }
    }
    
    return (
        <Dialog>
            <DialogTrigger className="flex gap-2">
                <CirclePlus />
                {open && <p>Create</p>}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new post</DialogTitle>
                    <DialogDescription>New post</DialogDescription>
                </DialogHeader>

                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="photos">Photos</Label>
                    <Input id="photos" type="file" multiple accept="image/*" onChange={handleFileChange}/>
                </div>

                {previewUrls.length > 0 && (
                    <div>
                        <Carousel className="w-full max-w-xs">
                            <CarouselContent>
                                {previewUrls.map((url, index) => (
                                    <CarouselItem key={index} className="flex justify-center items-center relative">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="h-64 w-auto max-w-full rounded-md object-contain"
                                        />
                                        <Button onClick={() => handleRemoveImage(index)} variant="secondary" size="icon" className="size-8 absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                            <X />
                                        </Button>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>Upload</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
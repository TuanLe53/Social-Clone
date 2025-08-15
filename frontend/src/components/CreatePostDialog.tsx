import { CirclePlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useSidebar } from "./ui/sidebar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, type ChangeEvent } from "react";

export default function CreatePostDialog() {
    const { open } = useSidebar();

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

                <div>
                    {previewUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            {previewUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-auto rounded-md object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
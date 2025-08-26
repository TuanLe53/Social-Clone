import { Pencil } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState, type ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AvatarEditor() {
    const [selectedFiles, setSelectedFiles] = useState<File | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            setSelectedFiles(file);

            const url = URL.createObjectURL(file);
            setPreviewUrls(url);
        }
    };

    return (
        <Badge
            className='absolute rounded-full bottom-0 right-0 p-1'
        >
            <Dialog>
                <DialogTrigger className="hover:cursor-pointer">
                        <Pencil size={16}/>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Avatar Editor</DialogTitle>
                        <DialogDescription>Description</DialogDescription>
                    </DialogHeader>

                    <div>
                        {previewUrls && (
                            <div className="flex flex-col items-center">
                                <img src={previewUrls} alt="Preview" className="mb-4 w-32 h-32 object-cover rounded-full" />
                            </div>
                        )}
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="photos">Photos</Label>
                            <Input id="photos" type="file" accept="image/*" onChange={handleFileChange}/>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Badge>
    )
}
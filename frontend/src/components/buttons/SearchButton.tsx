import { Search } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import SearchBar from "../SearchBar";

export default function SearchButton() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { setOpen } = useSidebar();

    const handleOpenChange = (newOpenState: boolean) => {
        if (!newOpenState) {
            setOpen(!newOpenState);
        }

        setIsOpen(newOpenState);
        setOpen(!newOpenState)
  };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger className="flex gap-2">
                <Search />
                {!isOpen && <p>Search</p>}
            </SheetTrigger>
            <SheetContent side="left" className="left-[48px] px-4">
                <SheetHeader className="mt-5">
                    <SheetTitle>Search</SheetTitle>
                </SheetHeader>

                <SearchBar />
                
            </SheetContent>
        </Sheet>
    )
}
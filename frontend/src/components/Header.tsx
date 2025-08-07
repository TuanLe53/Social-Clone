import { Button } from "./ui/button";

export default function Header() {
    
    return (
        <div className="sticky border-b border-indigo-500 w-full flex justify-between items-center py-2 px-4">
            <p>Social</p>
            <div>
                <Button>Login</Button>
                <Button variant={'ghost'}>Sign Up</Button>
            </div>
        </div>
    )
}
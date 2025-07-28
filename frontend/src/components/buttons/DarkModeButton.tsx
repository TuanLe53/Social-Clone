import { useTheme } from "@/contexts/theme";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export function DarkModeButton() {
    const { theme, setTheme } = useTheme();
    
    const isDarkMode = theme === "dark";

    const toggleDarkMode = () => {
        setTheme(isDarkMode ? "light" : "dark");
    };

    return (
        <div>
            <Label>Dark mode</Label>
            <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
            />
        </div>
    )
}
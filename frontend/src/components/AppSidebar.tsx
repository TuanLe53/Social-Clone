import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { AlignJustify } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { DarkModeButton } from "./buttons/DarkModeButton"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/">
          <h1>Social</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup />
        <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <Popover>
          <PopoverTrigger>
            <Button>
              <AlignJustify />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Button>
              Settings
            </Button>

            <DarkModeButton />

            <Button>
              Log out
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  )
}
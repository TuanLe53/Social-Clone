import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { AlignJustify } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { DarkModeButton } from "./buttons/DarkModeButton"
import SearchButton from "./buttons/SearchButton"

export function AppSidebar() {

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/">
          <h1>Social</h1>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <SearchButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>


      </SidebarContent>

      <SidebarFooter>
        <Popover>
          <PopoverTrigger>
            <AlignJustify />
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
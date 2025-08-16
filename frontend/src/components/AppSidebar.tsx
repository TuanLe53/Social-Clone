import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { AlignJustify, CirclePlus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { DarkModeButton } from "./buttons/DarkModeButton"
import SearchButton from "./buttons/SearchButton"
import CreatePostDialog from "./CreatePostDialog"

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="mt-5">
        <Link to="/">
          {state == "collapsed" ?
            <img src="https://placehold.co/50x50" alt="Placeholder image" />
            :
            <h1>Social</h1>
          }
        </Link>
      </SidebarHeader>

      <SidebarContent className="mt-10 ml-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <SearchButton />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <CreatePostDialog />
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
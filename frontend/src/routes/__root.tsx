import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/contexts/auth'
import type { Socket } from 'socket.io-client'
import { Toaster } from 'sonner'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { useEffect } from 'react'
import { notificationsSocket, socket } from '@/lib/socket'
import { ThemeProvider } from '@/contexts/theme'

interface MyRouterContext{
  socket: Socket;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {

  const { location } = useRouterState();
  const noSidebarRoutes = [
    '/login',
    '/register',
    // '/reset-password',
    // '/forgot-password',
    // '/verify-email',
  ];

  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  useEffect(() => {
    socket.connect();

    notificationsSocket.connect();

    return () => {
      socket.disconnect();
      notificationsSocket.disconnect();
    }
  })
  
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Conditionally render the layout based on the current route */}
        {showSidebar ? (
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              <Outlet />
            </main>
          </SidebarProvider>
        ) : (
          <main>
            <Outlet />
          </main>
        )}
        <Toaster />
        {/* <TanStackRouterDevtools /> */}
      </ThemeProvider>
    </AuthProvider>
  )
}
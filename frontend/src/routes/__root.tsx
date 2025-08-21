import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider, useAuth } from '@/contexts/auth'
import type { Socket } from 'socket.io-client'
import { Toaster } from 'sonner'
import { SidebarProvider } from '@/components/ui/sidebar'
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
  useEffect(() => {
    socket.connect();
    notificationsSocket.connect();

    return () => {
      socket.disconnect();
      notificationsSocket.disconnect();
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster position='top-right' richColors/>
        <AuthenticatedLayout />
        {/* <TanStackRouterDevtools /> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  ) : (
    <main>
      <Outlet />
    </main>
  );
}

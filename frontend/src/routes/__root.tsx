import { Outlet, createRootRoute, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '../components/Header'
import { AuthProvider } from '@/contexts/auth'
import type { Socket } from 'socket.io-client'
import { Toaster } from 'sonner'

interface MyRouterContext{
  socket: Socket;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <AuthProvider>
      <Header />
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </AuthProvider>
  )
})

// export const Route = createRootRoute({
//   component: () => (
//     <AuthProvider>

//       <Header />

//       <Outlet />
//       <TanStackRouterDevtools />
//     </AuthProvider>
//   ),
// })

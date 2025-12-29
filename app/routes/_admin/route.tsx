import { Outlet } from 'react-router'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import AdminSidebar from './admin-sidebar'

export default function AdminLayout() {
  return (
    <div
      className="mx-auto flex size-full min-h-screen w-full flex-col"
    >
      <SidebarProvider>
        <div className="flex grow overflow-hidden">
          <AdminSidebar />
          <main className="flex grow flex-col overflow-hidden bg-gray-100 p-2">
            <SidebarTrigger />
            <div className="mt-4 flex w-full max-w-7xl grow flex-col">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

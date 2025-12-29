import { LogOutIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~/components/ui/sidebar'
// import useLogout from '~/hooks/use-logout'

const menu = [
  {
    title: 'AI Knowledge',
    url: '/admin/ai-knowledge',
  },
]

export default function AdminSidebar() {
  const location = useLocation()

  const handleLogout = () => {
    globalThis.location.href = '/login'
  }

  return (
    <>
      <Sidebar>
        <SidebarContent className="flex flex-col">
          <SidebarGroup className="grow">
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith(item.url)}
                    >
                      <NavLink to={item.url}>{item.title}</NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarSeparator />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOutIcon className="mr-1" />
                  Log Out
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

import { BookOpen, BrainIcon, GraduationCap, Settings2, Sparkles, FolderIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link to="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shadow-sm">
                  <GraduationCap className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-bold tracking-tight">AgentCampus</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Academic AI Engine</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: 'Academic Operations',
              url: '/dashboard/academic',
              icon: GraduationCap,
            },
            {
              title: 'AI Approval Queue',
              url: '/dashboard/ai-approval',
              icon: Sparkles,
            },
            {
              title: 'Learning Workspace',
              url: '/dashboard',
              icon: FolderIcon,
            },
            {
              title: 'Settings',
              url: '/dashboard/settings',
              icon: Settings2,
            },
          ]}
        />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


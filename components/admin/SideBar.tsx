import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/ESMT",
      items: [],
    },
    {
      title: "Users",
      url: "/ESMT/users",
      items: [
        {
          title: "User Enrollment",
          url: "/ESMT/users/enrollment",
        },
        {
          title: "+ Add User",
          url: "/ESMT/users/new",
        },
      ],
    },
    {
      title: "Groups",
      url: "/ESMT/groups",
      items: [

      ],
    },
    {
      title: "Events",
      url: "/ESMT/calendar",
      items: [
        {
          title: "+ New Event",
          url: "/ESMT/calendar/new",
        },
      ],
    },
  ],
}

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image src={`/icons/Logo.svg`} alt={`Event Star Logo`} width={35} height={35} className="hover-minimize"/>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">EventStar ESMT</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

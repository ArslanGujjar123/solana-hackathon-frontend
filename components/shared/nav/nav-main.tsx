"use client"

import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SIDEBAR_MENU_LABEL } from "@/constants/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    tooltip?: string
    items?: {
      title: string
      url: string
      tooltip?: string
    }[]
  }[]
}) {
  const { state, isMobile } = useSidebar()

  return (
    <TooltipProvider>
      <SidebarGroup>
        <SidebarGroupLabel>{SIDEBAR_MENU_LABEL}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren = item.items && item.items.length > 0
            const tooltipText = item.tooltip ?? item.title

            if (!hasChildren) {
              return (
                <SidebarMenuItem key={item.title}>
                  <Tooltip side="right" align="center">
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      hidden={state !== "collapsed" || isMobile}
                    >
                      <p>{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              )
            }

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <Tooltip side="right" align="center">
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      hidden={state !== "collapsed" || isMobile}
                    >
                      <p>{tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const subTooltipText = subItem.tooltip ?? subItem.title

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <Tooltip side="right" align="center">
                              <TooltipTrigger asChild>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </TooltipTrigger>
                              <TooltipContent
                                hidden={state !== "collapsed" || isMobile}
                              >
                                <p>{subTooltipText}</p>
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  )
}

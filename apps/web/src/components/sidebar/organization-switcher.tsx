import { Link, useRouter } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { useAtom } from "jotai/react";
import { ChevronDown, Command } from "lucide-react";
import { activeOrganizationAtom } from "~/lib/atoms";
import { authClient } from "~/lib/auth-client";
import { useOrganizationSwitcher } from "~/lib/hooks/query/use-organization-switcher";

export function OrgSwitcher() {
  const router = useRouter();

  const { organizationUser } = useOrganizationSwitcher();

  const [activeOrganization, setActiveOrganization] = useAtom(
    activeOrganizationAtom,
  );

  if (!activeOrganization) {
    setActiveOrganization(
      Object.values(organizationUser)[0].organization as any,
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-3" />
              </div>
              <span className="truncate font-semibold">
                {
                  (
                    activeOrganization ??
                    Object.values(organizationUser)[0].organization
                  ).name
                }
              </span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg text-muted-foreground"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {Object.entries(organizationUser).map(([id, userOrg], index) => (
              <DropdownMenuItem
                key={id}
                onSelect={() =>
                  setActiveOrganization(userOrg.organization as any)
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-xs border">
                  {/* TODO: Add team logo */}
                  <Command className="size-4 shrink-0" />
                </div>
                {userOrg.organization.name}
                {/* TODO: Bind keyboard shortcut */}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link to="/app/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.navigate({
                        to: "/",
                      });
                    },
                  },
                })
              }
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

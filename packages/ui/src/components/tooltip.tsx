"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui-components/react/tooltip";

import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";
import { Keybind } from "./keybind";

function TooltipProvider({
  timeout = 750,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      timeout={timeout}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  side,
  children,
  keybind,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof TooltipPrimitive.Positioner>,
    "side" | "sideOffset"
  > & {
    keybind?: string;
  }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        sideOffset={sideOffset}
        side={side}
        align="center"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "bg-[#222225] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-sm px-2 py-1.5 text-xs text-balance border shadow-lg flex items-center gap-2 mb-1",
            className
          )}
          {...props}
        >
          {children}
          {keybind && <Keybind keybind={keybind} />}
          {/* <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" /> */}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

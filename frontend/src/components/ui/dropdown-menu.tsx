import * as React from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

// Re-export Radix dropdown primitives with simple defaults so the app can
// import them from "./ui/dropdown-menu". This keeps Navigation.tsx unchanged.

export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger as unknown as React.ComponentType<
  React.PropsWithChildren<{
    asChild?: boolean;
    children?: React.ReactNode;
  }>
>;
export const DropdownMenuContent: React.FC<React.ComponentProps<typeof RadixDropdown.Content>> = (
  props,
) => <RadixDropdown.Content {...props} />;
export const DropdownMenuItem: React.FC<React.ComponentProps<typeof RadixDropdown.Item>> = (
  props,
) => <RadixDropdown.Item {...props} />;
export const DropdownMenuSeparator: React.FC<React.ComponentProps<typeof RadixDropdown.Separator>> = (
  props,
) => <RadixDropdown.Separator {...props} />;

export default DropdownMenu;

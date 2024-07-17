import {
  ArrowRightIcon,
  CircleIcon,
  ImageIcon,
  MinusIcon,
  Plus,
  RectangleHorizontalIcon,
  ShapesIcon,
  SquareIcon,
  StarIcon,
  Type,
} from "lucide-react"

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/shared/ui-kit/menubar"

export function Insert() {
  return (
    <MenubarMenu>
      <MenubarTrigger className="px-2 py-0.5">Insert</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <ImageIcon className="mr-2 h-5 w-5" />
          Image
        </MenubarItem>
        <MenubarItem>
          <Type className="mr-2 h-5 w-5" />
          Text box
        </MenubarItem>
        <MenubarSub>
          <MenubarSubTrigger>
            <ShapesIcon className="mr-2 h-5 w-5" />
            Shape
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>
              <MinusIcon className="mr-2 h-5 w-5" />
              Line
            </MenubarItem>
            <MenubarItem>
              <SquareIcon className="mr-2 h-5 w-5" />
              Square
            </MenubarItem>
            <MenubarItem>
              <RectangleHorizontalIcon className="mr-2 h-5 w-5" />
              Rectangle
            </MenubarItem>
            <MenubarItem>
              <CircleIcon className="mr-2 h-5 w-5" />
              Circle
            </MenubarItem>
            <MenubarItem>
              <ArrowRightIcon className="mr-2 h-5 w-5" />
              Arrow
            </MenubarItem>
            <MenubarItem>
              <StarIcon className="mr-2 h-5 w-5" />
              Star
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem>
          <Plus className="mr-2 h-5 w-5" />
          New slide
          <MenubarShortcut>Ctrl+M</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

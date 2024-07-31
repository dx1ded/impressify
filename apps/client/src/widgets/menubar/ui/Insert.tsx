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

import { AddSlide } from "~/features/add-slide"
import { ChangeShapesType, InsertImage, InsertText } from "~/features/insert-element"
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
        <InsertText>
          {(insertText) => (
            <MenubarItem onSelect={insertText}>
              <Type className="mr-2 h-5 w-5" />
              Text box
            </MenubarItem>
          )}
        </InsertText>
        <InsertImage>
          {(insertImage) => (
            <MenubarItem onSelect={insertImage}>
              <ImageIcon className="mr-2 h-5 w-5" />
              Image
            </MenubarItem>
          )}
        </InsertImage>
        <MenubarSub>
          <MenubarSubTrigger>
            <ShapesIcon className="mr-2 h-5 w-5" />
            Shape
          </MenubarSubTrigger>
          <MenubarSubContent>
            <ChangeShapesType>
              {(changeShapesType) => (
                <>
                  <MenubarItem onSelect={() => changeShapesType("line")}>
                    <MinusIcon className="mr-2 h-5 w-5" />
                    Line
                  </MenubarItem>
                  <MenubarItem onSelect={() => changeShapesType("square")}>
                    <SquareIcon className="mr-2 h-5 w-5" />
                    Square
                  </MenubarItem>
                  <MenubarItem onSelect={() => changeShapesType("rectangle")}>
                    <RectangleHorizontalIcon className="mr-2 h-5 w-5" />
                    Rectangle
                  </MenubarItem>
                  <MenubarItem onSelect={() => changeShapesType("circle")}>
                    <CircleIcon className="mr-2 h-5 w-5" />
                    Circle
                  </MenubarItem>
                  <MenubarItem onSelect={() => changeShapesType("arrow")}>
                    <ArrowRightIcon className="mr-2 h-5 w-5" />
                    Arrow
                  </MenubarItem>
                  <MenubarItem onSelect={() => changeShapesType("star")}>
                    <StarIcon className="mr-2 h-5 w-5" />
                    Star
                  </MenubarItem>
                </>
              )}
            </ChangeShapesType>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <AddSlide>
          {(addSlide) => (
            <MenubarItem onSelect={addSlide}>
              <Plus className="mr-2 h-5 w-5" />
              New slide
              <MenubarShortcut>Ctrl+M</MenubarShortcut>
            </MenubarItem>
          )}
        </AddSlide>
      </MenubarContent>
    </MenubarMenu>
  )
}

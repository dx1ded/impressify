import { SelectTrigger, SelectItem } from "@radix-ui/react-select"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { type ReactNode, useState } from "react"

import { Button } from "~/shared/ui-kit/button"
import { Select, SelectContent } from "~/shared/ui-kit/select"
import { Tooltip, TooltipContent } from "~/shared/ui-kit/tooltip"
import { DEFAULT_COLORS_PALETTE } from "~/shared/ui/ColorPicker"

interface ColorPickerProps {
  children: ReactNode
  defaultColor: string
  onChange?(value: string): void
}

export function ColorPicker({ defaultColor, children, onChange }: ColorPickerProps) {
  const [selectValue, setSelectValue] = useState(defaultColor)

  const changeHandler = (value: string) => {
    setSelectValue(value)
    if (onChange) onChange(value)
  }

  return (
    <Select defaultValue={selectValue} onValueChange={changeHandler}>
      <SelectTrigger asChild>
        <div className="relative">
          {children}
          <div className="absolute -bottom-0.5 h-1 w-full" style={{ backgroundColor: selectValue }} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <div className="mb-1 grid grid-cols-10 gap-1">
          {DEFAULT_COLORS_PALETTE.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <SelectItem value={item.color} asChild>
                  <button
                    type="button"
                    className="h-4 w-4"
                    style={{ backgroundColor: item.color }}
                    aria-label={item.title}
                  />
                </SelectItem>
              </TooltipTrigger>
              <TooltipContent>{item.title}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <SelectItem value="transparent" asChild>
          <Button size="sm" variant="outline" className="h-6 w-full p-1 text-xs">
            Transparent
          </Button>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

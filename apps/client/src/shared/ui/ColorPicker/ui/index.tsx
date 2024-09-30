import { SelectTrigger, SelectItem } from "@radix-ui/react-select"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { memo, type ReactNode, useMemo } from "react"

import { isColor } from "~/shared/lib"
import { Button } from "~/shared/ui-kit/button"
import { Select, SelectContent } from "~/shared/ui-kit/select"
import { Tooltip, TooltipContent } from "~/shared/ui-kit/tooltip"
import { DEFAULT_COLORS_PALETTE } from "~/shared/ui/ColorPicker"

interface ColorPickerProps {
  children: ReactNode
  color: string
  disabled?: boolean
  hasTransparent?: boolean
  onChange?(value: string): void
}

export const ColorPicker = memo(function ColorPicker({
  color,
  children,
  disabled,
  hasTransparent = true,
  onChange,
}: ColorPickerProps) {
  const changeHandler = (value: string) => {
    if (onChange) onChange(value)
  }

  const ColorItems = useMemo(
    () =>
      DEFAULT_COLORS_PALETTE.map((item) => (
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
      )),
    [],
  )

  return (
    <Select value={color} disabled={disabled} onValueChange={changeHandler}>
      <SelectTrigger asChild>
        <div className="relative">
          {children}
          {isColor(color) && <div className="absolute -bottom-0.5 h-1 w-full" style={{ backgroundColor: color }} />}
        </div>
      </SelectTrigger>
      <SelectContent>
        <div className="mb-1 grid grid-cols-10 gap-1">{ColorItems}</div>
        {hasTransparent && (
          <SelectItem value="transparent" asChild>
            <Button size="sm" variant="outline" className="h-6 w-full p-1 text-xs">
              Transparent
            </Button>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
})

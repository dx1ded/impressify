import { useEffect, useRef } from "react"
import { Transformer } from "react-konva"
import type { Transformer as ITransformer } from "konva/lib/shapes/Transformer"
import { useDebouncedCallback } from "use-debounce"

import {
  type ElementProps,
  type ElementComponent,
  imageProps,
  shapeProps,
  textProps,
  setSelectedId,
  editElement,
} from "~/entities/presentation"
import { useAppDispatch } from "~/shared/model"

const DEBOUNCE_EDIT_TIME = 3000

interface ElementWrapperProps {
  Element: ElementComponent | undefined
  props: ElementProps
  isSelected: boolean
}

export function ElementWrapper({ Element, props, isSelected }: ElementWrapperProps) {
  const dispatch = useAppDispatch()
  const elementRef = useRef<never>(null)
  const trRef = useRef<ITransformer>(null)

  useEffect(() => {
    if (isSelected && elementRef.current && trRef.current) {
      trRef.current.nodes([elementRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  const debouncedEdit = useDebouncedCallback((newProps: ElementProps) => {
    dispatch(editElement(newProps))
  }, DEBOUNCE_EDIT_TIME)

  return (
    Element && (
      <>
        <Element
          ref={elementRef}
          x={props.x}
          y={props.y}
          width={props.width * props.scaleX}
          height={props.height * props.scaleY}
          rotation={props.angle}
          {...textProps(props)}
          {...imageProps(props)}
          {...shapeProps(props)}
          draggable
          onClick={() => dispatch(setSelectedId(props.id))}
          onDragStart={() => !isSelected && dispatch(setSelectedId(props.id))}
          onDragEnd={(e) => debouncedEdit({ ...props, x: e.target.x(), y: e.target.y() })}
          onTransform={(e) => {
            const node = e.target
            node.width(node.width() * node.scaleX())
            node.height(node.height() * node.scaleY())
            node.scaleX(1)
            node.scaleY(1)
          }}
          onTransformEnd={(e) =>
            debouncedEdit({
              ...props,
              width: e.target.width(),
              height: e.target.height(),
              scaleX: e.target.scaleX(),
              scaleY: e.target.scaleY(),
            })
          }
          {...(props.__typename === "Text"
            ? {
                onChange: (value: string) => dispatch(editElement({ ...props, text: value })),
                onToggleEdit: (value: boolean) => console.log(value),
              }
            : {})}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) =>
              Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5 ? oldBox : newBox
            }
          />
        )}
      </>
    )
  )
}

import type { KonvaEventObject } from "konva/lib/Node"
import { useEffect, useRef } from "react"
import { Transformer } from "react-konva"
import { Shape } from "konva/lib/Shape"
import type { Transformer as ITransformer } from "konva/lib/shapes/Transformer"

import {
  type ElementProps,
  type ElementComponent,
  imageProps,
  shapeProps,
  textProps,
  setSelectedId,
} from "~/entities/presentation"
import { useAppDispatch } from "~/shared/model"

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

  const clickHandler = (e: KonvaEventObject<MouseEvent>) => {
    dispatch(setSelectedId(props.id))
  }

  return (
    Element && (
      <>
        <Element
          ref={elementRef}
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          rotation={props.angle}
          {...textProps(props)}
          {...imageProps(props)}
          {...shapeProps(props)}
          draggable
          onClick={clickHandler}
          onDragEnd={(e: KonvaEventObject<DragEvent>) => {
            // here I save it to my state
          }}
          onTransformEnd={(e: KonvaEventObject<Event>) => {
            const node = elementRef.current as Shape | null
            if (!node) return

            const scaleX = node.scaleX()
            const scaleY = node.scaleY()

            // // Reset scale to 1 to get the actual size
            // node.scaleX(1)
            // node.scaleY(1)
            // here I save it to my state
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) =>
              Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5 ? oldBox : newBox
            }
          />
        )}
      </>
    )
  )
}

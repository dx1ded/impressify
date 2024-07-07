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
  changeTextProps,
  setMode,
  setShape,
  type Shapes,
} from "~/entities/presentation"
import { useAppDispatch } from "~/shared/model"

const DEBOUNCE_EDIT_TIME = 3000

interface ElementWrapperProps {
  Element: ElementComponent | undefined
  props: ElementProps
  isSelected: boolean
  isEditing: boolean
}

export function ElementWrapper({ Element, props, isSelected, isEditing }: ElementWrapperProps) {
  const dispatch = useAppDispatch()
  const elementRef = useRef<never>(null)
  const trRef = useRef<ITransformer>(null)

  useEffect(() => {
    if (isSelected && elementRef.current && trRef.current) {
      trRef.current.nodes([elementRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, isEditing])

  const debouncedEdit = useDebouncedCallback((newProps: Partial<ElementProps>) => {
    dispatch(editElement({ ...newProps, id: props.id }))
  }, DEBOUNCE_EDIT_TIME)

  const selectElement = () => {
    if (!isSelected) dispatch(setSelectedId(+props.id))
    const type = props.__typename
    if (type === "Text") dispatch(setMode("text"))
    else if (type === "Image") dispatch(setMode("image"))
    else if (type === "Shape") {
      dispatch(setMode("shape"))
      dispatch(setShape(props.type as Shapes))
    }
  }

  return (
    Element && (
      <>
        <Element
          ref={elementRef}
          id={`${props.id}`}
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          rotation={props.angle}
          {...textProps(props)}
          {...imageProps(props)}
          {...shapeProps(props)}
          draggable
          onClick={selectElement}
          onDragStart={selectElement}
          onDragEnd={(e) =>
            /*
              I'm using the same props (width / height / angle) as for onTransformEnd (and vice versa) because since the function is debounced,
              the previous transformation / drag might be lost. That's why, I need to get the most recent properties for the `ref`
            */
            debouncedEdit({
              x: e.target.x(),
              y: e.target.y(),
              width: e.target.width(),
              height: e.target.height(),
              angle: e.target.rotation(),
            })
          }
          onTransform={(e) => {
            const node = e.target
            node.width(node.width() * node.scaleX())
            node.height(node.height() * node.scaleY())
            node.scaleX(1)
            node.scaleY(1)
          }}
          onTransformEnd={(e) =>
            debouncedEdit({
              x: e.target.x(),
              y: e.target.y(),
              width: e.target.width(),
              height: e.target.height(),
              angle: e.target.rotation(),
            })
          }
          {...(props.__typename === "Text"
            ? {
                isEditing,
                debouncedEdit,
                onToggleEdit: (value: boolean) => dispatch(changeTextProps({ isEditing: value })),
              }
            : {})}
        />
        {isSelected && !isEditing && (
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

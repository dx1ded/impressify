import { memo, useEffect, useRef } from "react"
import { Transformer } from "react-konva"
import type { Transformer as ITransformer } from "konva/lib/shapes/Transformer"
import { useDebouncedCallback } from "use-debounce"

import {
  type ElementProps,
  type ElementComponent,
  type Mode,
  type Shapes,
  imageProps,
  shapeProps,
  textProps,
  selectElement,
  editElement,
  changeTextProps,
  setMode,
  setShape,
} from "~/entities/presentation"
import { useAppDispatch } from "~/shared/model"

const DEBOUNCE_EDIT_TIME = 3000

interface ElementWrapperProps {
  Element: ElementComponent | undefined
  props: ElementProps
  mode: Mode
  isSelected: boolean
  isEditing: boolean
}

export const ElementWrapper = memo(function ElementWrapper({
  Element,
  props,
  mode,
  isSelected,
  isEditing,
}: ElementWrapperProps) {
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
    // Using id to avoid transformations being applied for `selectedId` (which would be used if not id provided)
    dispatch(editElement({ ...newProps, id: props.id }))
  }, DEBOUNCE_EDIT_TIME)

  const selectElementHandler = () => {
    const type = props.__typename
    // type is lowercased because __typename has first letter uppercased and modes are all lowercased
    if (mode !== type?.toLowerCase() && mode !== "cursor") return
    // Select element
    if (!isSelected) dispatch(selectElement(props.id))
    // After element is selected set a corresponding toolbar mode
    if (mode !== "text" && type === "Text") dispatch(setMode("text"))
    else if (mode !== "image" && type === "Image") dispatch(setMode("image"))
    else if (mode !== "shape" && type === "Shape") {
      dispatch(setMode("shape"))
      dispatch(setShape(props.type as Shapes))
    }
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
          onClick={selectElementHandler}
          onDragStart={selectElementHandler}
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
})

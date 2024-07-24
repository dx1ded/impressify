import { memo, useEffect, useRef } from "react"
import { Transformer } from "react-konva"
import type { Transformer as ITransformer } from "konva/lib/shapes/Transformer"
import type { KonvaEventObject } from "konva/lib/Node"

import {
  type ElementProps,
  type ElementComponent,
  type Mode,
  generateEditElementId,
  imageProps,
  shapeProps,
  textProps,
  getAnchors,
  selectElement,
  editElement,
  changeShapeProps,
  setMode,
  setIsEditing,
  MIN_ELEMENT_WIDTH,
  MIN_ELEMENT_HEIGHT,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import { useAppDispatch, useDebouncedFunctions } from "~/shared/model"

const DEBOUNCE_EDIT_TIME = 3000

interface ElementWrapperProps {
  Element: ElementComponent | undefined
  props: ElementProps
  mode: Mode
  isSelected: boolean
  isCreating: boolean
  isEditing: boolean
}

export const ElementWrapper = memo(function ElementWrapper({
  Element,
  props,
  mode,
  isSelected,
  isCreating,
  isEditing,
}: ElementWrapperProps) {
  const dispatch = useAppDispatch()
  const elementRef = useRef<never>(null)
  const trRef = useRef<ITransformer>(null)
  const { register, call } = useDebouncedFunctions()

  useEffect(() => {
    if (isSelected && elementRef.current && trRef.current) {
      trRef.current.nodes([elementRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, isEditing])

  const debouncedEdit = register(
    generateEditElementId(props.id),
    (newProps: Partial<ElementProps>) => {
      // Using id to avoid transformations being applied for `selectedId` (which would be used if not id provided)
      dispatch(editElement({ ...newProps, id: props.id }))
      call(TAKE_SCREENSHOT_ID)
    },
    DEBOUNCE_EDIT_TIME,
  )

  const transformElement = (e: KonvaEventObject<Event>) => {
    debouncedEdit({
      x: e.target.x(),
      y: e.target.y(),
      width: e.target.width(),
      height: e.target.height(),
      angle: e.target.rotation(),
      ...(props.__typename !== "Text"
        ? {
            scaleX: e.target.scaleX(),
            scaleY: e.target.scaleY(),
          }
        : {}),
    })
  }

  const selectElementHandler = () => {
    const type = props.__typename
    if (isCreating) return
    if (!isSelected) dispatch(selectElement(props.id))
    // After element is selected set a corresponding toolbar mode
    if (mode !== "text" && type === "Text") dispatch(setMode("text"))
    else if (mode !== "image" && type === "Image") dispatch(setMode("image"))
    else if (mode !== "shape" && type === "Shape") {
      dispatch(setMode("shape"))
      dispatch(changeShapeProps({ type: props.type }))
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
          scaleX={props.scaleX}
          scaleY={props.scaleY}
          rotation={props.angle}
          {...textProps(props)}
          {...imageProps(props)}
          {...shapeProps(props)}
          draggable
          onClick={selectElementHandler}
          onDragStart={selectElementHandler}
          onDragEnd={transformElement}
          onTransformEnd={transformElement}
          onTransform={(e) => {
            /*
              Transform by default changes scaleX and scaleY instead of width and height. We don't want textbox to have
              scaleX and scaleY, so we only change its width and height and then reset the scales.
            */
            if (props.__typename !== "Text") return
            const node = e.target
            node.width(node.width() * node.scaleX())
            node.height(node.height() * node.scaleY())
            node.scaleX(1)
            node.scaleY(1)
          }}
          {...(props.__typename === "Text"
            ? {
                isEditing,
                debouncedEdit,
                onToggleEdit: (value: boolean) => dispatch(setIsEditing(value)),
              }
            : {})}
        />
        {isSelected && !isEditing && (
          <Transformer
            ref={trRef}
            flipEnabled={false}
            enabledAnchors={getAnchors(props)}
            boundBoxFunc={(oldBox, newBox) =>
              Math.abs(newBox.width) < MIN_ELEMENT_WIDTH ||
              (props.__typename === "Shape" && (props.type === "line" || props.type === "arrow")
                ? false
                : Math.abs(newBox.height) < MIN_ELEMENT_HEIGHT)
                ? oldBox
                : newBox
            }
          />
        )}
      </>
    )
  )
})

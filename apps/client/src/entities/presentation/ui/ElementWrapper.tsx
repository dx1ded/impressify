import type { YPresentation } from "@server/hocuspocus/types"
import type { KonvaEventObject } from "konva/lib/Node"
import type { Transformer as ITransformer } from "konva/lib/shapes/Transformer"
import { memo, useEffect, useRef } from "react"
import { Transformer } from "react-konva"

import { ShapeType } from "~/__generated__/graphql"
import {
  type ElementComponent,
  type ElementProps,
  type Mode,
  setIsEditing,
  setMode,
  setShapeProps,
  editElement,
  selectElement,
  generateEditElementId,
  getAnchors,
  textProps,
  shapeProps,
  imageProps,
  MIN_ELEMENT_HEIGHT,
  MIN_ELEMENT_WIDTH,
  TAKE_SCREENSHOT_ID,
} from "~/entities/presentation"
import { useAppDispatch, useDebouncedFunctions, useYjs } from "~/shared/model"

const DEBOUNCE_EDIT_TIME = 2000

interface ElementWrapperProps {
  Element: ElementComponent | undefined
  props: ElementProps
  mode: Mode
  currentSlide: number
  isSelected: boolean
  isCreating: boolean
  isEditing: boolean
}

export const ElementWrapper = memo(function ElementWrapper({
  Element,
  props,
  mode,
  currentSlide,
  isSelected,
  isCreating,
  isEditing,
}: ElementWrapperProps) {
  const dispatch = useAppDispatch()
  const elementRef = useRef<never>(null)
  const trRef = useRef<ITransformer>(null)
  const { register, call } = useDebouncedFunctions()
  const { provider, getMap } = useYjs()

  useEffect(() => {
    if (isSelected && elementRef.current && trRef.current) {
      trRef.current.nodes([elementRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, isEditing])

  const debouncedEdit = register(
    generateEditElementId(props.id),
    (newProps: Partial<ElementProps>) => {
      // Using id to avoid transformations being applied for `selectedId` (which would be used if no id provided)
      dispatch(editElement({ ...newProps, id: props.id }))
      call(TAKE_SCREENSHOT_ID)

      const yElement = getMap<YPresentation>()
        .get("slides")
        ?.get(currentSlide)
        ?.get("elements")
        ?.toArray()
        .find((_element) => _element.get("id") === props.id)!

      provider?.document.transact(() => {
        Object.keys(newProps).forEach((key) => {
          const typedKey = key as keyof ElementProps
          const typedValue = newProps[typedKey]
          if (!typedValue) return
          yElement.set(typedKey, typedValue)
        })
      })
    },
    DEBOUNCE_EDIT_TIME,
    [currentSlide],
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
      dispatch(setShapeProps({ type: props.type }))
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
              (props.__typename === "Shape" && (props.type === ShapeType.Line || props.type === ShapeType.Arrow)
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

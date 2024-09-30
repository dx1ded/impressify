import PptxGenJS from "pptxgenjs"

import { Alignment, ShapeType } from "~/__generated__/graphql"
import { type SlideProps, pxToInches, TAKE_SCREENSHOT_ID, EDIT_ELEMENT_ID } from "~/entities/presentation"
import { type ChildrenAsCallbackWithFn, isColor } from "~/shared/lib"
import { useDebouncedFunctions } from "~/shared/model"

export function DownloadPresentation({ children }: ChildrenAsCallbackWithFn<[string, SlideProps[]]>) {
  const { flush, flushWithPattern } = useDebouncedFunctions()

  const _download = async (presentationName: string, slides: SlideProps[]) => {
    flushWithPattern(EDIT_ELEMENT_ID)
    flush(TAKE_SCREENSHOT_ID)

    const pptx = new PptxGenJS()

    // Adding slides to pptx
    slides.forEach((slide) => {
      const _slide = pptx.addSlide()
      _slide.background = isColor(slide.bg) ? { color: slide.bg } : { path: slide.bg }
      slide.elements.forEach((element) => {
        const commonProps = {
          x: pxToInches(element.x),
          y: pxToInches(element.y),
          w: pxToInches(element.width * element.scaleX),
          h: pxToInches(element.height * element.scaleY),
          rotate: element.angle,
        }

        if (element.__typename === "Text") {
          _slide.addText(element.text, {
            ...commonProps,
            color: element.textColor,
            fill: {
              color: element.fillColor === "transparent" ? "#ffffff" : element.fillColor,
              transparency: element.fillColor === "transparent" ? 100 : 0,
            },
            fontSize: element.fontSize,
            fontFace: element.fontFamily,
            bold: element.bold,
            italic: element.italic,
            underline: { style: element.underlined ? "sng" : "none" },
            align:
              element.alignment === Alignment.Left
                ? "left"
                : element.alignment === Alignment.Center
                  ? "center"
                  : "right",
            lineSpacing: element.fontSize * element.lineHeight,
          })
        } else if (element.__typename === "Image") {
          _slide.addImage({
            ...commonProps,
            path: element.imageUrl,
          })
        } else {
          _slide.addShape(
            element.type === ShapeType.Line
              ? "line"
              : element.type === ShapeType.Rectangle || element.type === ShapeType.Square
                ? "rect"
                : element.type === ShapeType.Circle
                  ? "ellipse"
                  : element.type === ShapeType.Arrow
                    ? "rightArrow"
                    : "star5",
            {
              ...commonProps,
              fill: {
                color: element.fillColor === "transparent" ? "#ffffff" : element.fillColor,
                transparency: element.fillColor === "transparent" ? 100 : 0,
              },
            },
          )
        }
      })
    })

    // Writing a blob from pptx
    const blob = (await pptx.write({ outputType: "blob", compression: true })) as Blob

    // Downloading the file
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${presentationName}.pptx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return children(_download)
}

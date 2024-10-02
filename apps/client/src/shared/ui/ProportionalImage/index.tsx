import { useEffect, useState } from "react"
import { Image as KonvaImage } from "react-konva"
import type { ImageConfig } from "konva/lib/shapes/Image"

interface ProportionalImageProps extends Omit<ImageConfig, "width" | "height"> {
  width: number
  height: number
  fit?: "cover" | "contain" // Optional fit strategy
}

export function ProportionalImage({ width, height, fit = "cover", image, ...restProps }: ProportionalImageProps) {
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (image && image.complete) {
      // If the image is already loaded, get its dimensions
      setImgDimensions({ w: image.width, h: image.height })
    } else if (image) {
      // If the image isn't loaded yet, set a load event listener
      const handleImageLoad = () => {
        setImgDimensions({ w: image.width, h: image.height })
      }

      image.addEventListener("load", handleImageLoad)

      return () => {
        image.removeEventListener("load", handleImageLoad)
      }
    }
  }, [image])

  const calculateProportions = () => {
    const imageAspectRatio = imgDimensions.w / imgDimensions.h
    const containerAspectRatio = width / height

    let newWidth = width
    let newHeight = height

    if (fit === "cover") {
      if (imageAspectRatio > containerAspectRatio) {
        newHeight = height
        newWidth = newHeight * imageAspectRatio
      } else {
        newWidth = width
        newHeight = newWidth / imageAspectRatio
      }
    } else if (fit === "contain") {
      if (imageAspectRatio > containerAspectRatio) {
        newWidth = width
        newHeight = newWidth / imageAspectRatio
      } else {
        newHeight = height
        newWidth = newHeight * imageAspectRatio
      }
    }

    return {
      x: (width - newWidth) / 2, // Center horizontally
      y: (height - newHeight) / 2, // Center vertically
      width: newWidth,
      height: newHeight,
    }
  }

  // Wait until the image is loaded and dimensions are available
  if (!image || imgDimensions.w === 0 || imgDimensions.h === 0) return

  const { x, y, width: finalWidth, height: finalHeight } = calculateProportions()

  return <KonvaImage {...restProps} x={x} y={y} width={finalWidth} height={finalHeight} image={image} />
}

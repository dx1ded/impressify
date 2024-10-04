import { Link } from "react-router-dom"

import { cn } from "~/shared/lib"
import { DEFAULT_URL } from "~/shared/ui/Logo/model"
import ImpressifyLogo from "~/assets/impressify-logo.png"

interface LogoProps {
  className?: string
  textClassName?: string
  /**
   * Size in rem
   */
  size?: number
  /**
   * No text
   */
  noText?: boolean
  url?: string
}

export function Logo({ className, textClassName, size = 3, noText = false, url = DEFAULT_URL }: LogoProps) {
  return (
    <Link to={url} className="inline-flex flex-shrink-0 items-center gap-2 font-medium">
      <img
        className={cn(className)}
        style={{ width: `${size}rem`, height: `${size}rem` }}
        src={ImpressifyLogo}
        alt="Impressify logo"
      />
      {!noText && <p className={cn("text-lg", textClassName)}>Impressify</p>}
    </Link>
  )
}

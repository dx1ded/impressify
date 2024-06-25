import { Link } from "react-router-dom"

import ImpressifyLogo from "~/assets/impressify-logo.png"
import { DEFAULT_URL } from "~/shared/ui/Logo/model"

interface LogoProps {
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

export function Logo({ size = 3, noText = false, url = DEFAULT_URL }: LogoProps) {
  return (
    <Link to={url} className="inline-flex items-center gap-2 text-lg font-medium">
      <img
        src={ImpressifyLogo}
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
        }}
        alt="Impressify logo"
      />
      {!noText && "Impressify"}
    </Link>
  )
}

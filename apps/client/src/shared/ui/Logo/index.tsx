import { Link } from "react-router-dom"

import ImpressifyLogo from "~/assets/impressify-logo.png"

interface LogoProps {
  /**
   * Size in rem
   */
  size?: number
  /**
   * No text
   */
  noText?: boolean
}

export function Logo({ size = 3, noText = false }: LogoProps) {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-lg font-medium">
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

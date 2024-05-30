import { Link } from "react-router-dom"

import ImpressifyLogo from "~/assets/impressify-logo.png"

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-lg font-medium">
      <img src={ImpressifyLogo} className="h-12 w-12" alt="Impressify logo" />
      Impressify
    </Link>
  )
}

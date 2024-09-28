import { Link } from "react-router-dom"

import Illustration404 from "~/assets/404-illustation.svg"
import { Button } from "~/shared/ui-kit/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <img src={Illustration404} className="block w-full max-w-[40rem]" alt="Not found" />
      <Button asChild variant="blue">
        <Link to="/home">Go home</Link>
      </Button>
    </div>
  )
}

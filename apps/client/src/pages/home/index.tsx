import { Header } from "~/pages/home/ui/Header"
import { CreateNew } from "~/pages/home/ui/CreateNew"
import { Recent } from "~/pages/home/ui/Recent"

export function Home() {
  return (
    <div>
      <Header />
      <CreateNew />
      <Recent />
    </div>
  )
}

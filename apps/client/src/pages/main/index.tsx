import { Benefits } from "~/pages/main/ui/Benefits"
import { Features } from "~/pages/main/ui/Features"
import { Hero } from "~/pages/main/ui/Hero"
import { Plans } from "~/pages/main/ui/Plans"
import { Support } from "~/pages/main/ui/Support"
import { Footer } from "~/widgets/footer"
import { Header, HeaderProvider } from "~/widgets/header"

export default function Main() {
  return (
    <HeaderProvider>
      <div>
        <Header />
        <Hero />
        <Support />
        <Features />
        <Benefits />
        <Plans />
        <Footer />
      </div>
    </HeaderProvider>
  )
}

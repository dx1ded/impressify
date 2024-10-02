import { Benefits } from "~/pages/main/ui/Benefits"
import { Features } from "~/pages/main/ui/Features"
import { Hero } from "~/pages/main/ui/Hero"
import { Plans } from "~/pages/main/ui/Plans"
import { Support } from "~/pages/main/ui/Support"
import { Footer } from "~/widgets/footer"
import { Header, HeaderProvider } from "~/widgets/header"
import { withTransition } from "~/shared/model"

function Main() {
  return (
    <HeaderProvider>
      <Header />
      <Hero />
      <Support />
      <Features />
      <Benefits />
      <Plans />
      <Footer />
    </HeaderProvider>
  )
}

export default withTransition(Main)

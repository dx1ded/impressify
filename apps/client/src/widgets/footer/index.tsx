import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"
import { Small } from "~/shared/ui/Typography"

export function Footer() {
  return (
    <footer className="bg-secondary-foreground py-4 text-white max-lg:py-3">
      <Container className="flex items-center justify-between max-sm:flex-col max-sm:gap-4">
        <Logo className="max-lg:!h-9 max-lg:!w-9" />
        <nav>
          <ul className="flex list-none flex-wrap items-center justify-center gap-9 max-md:gap-6 max-sm:gap-y-3">
            <li>
              <Small as="a" href="#home">
                Home
              </Small>
            </li>
            <li>
              <Small as="a" href="#support">
                Support
              </Small>
            </li>
            <li>
              <Small as="a" href="#features">
                Features
              </Small>
            </li>
            <li>
              <Small as="a" href="#benefits">
                Benefits
              </Small>
            </li>
            <li>
              <Small as="a" href="#pricing">
                Pricing
              </Small>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  )
}

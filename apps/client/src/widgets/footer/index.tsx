import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"
import { Small } from "~/shared/ui/Typography"

export function Footer() {
  return (
    <footer className="bg-secondary-foreground py-4 text-white">
      <Container className="flex items-center justify-between">
        <Logo />
        <nav>
          <ul className="flex list-none items-center gap-9">
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

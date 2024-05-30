import { SignInButton, SignUpButton } from "@clerk/clerk-react"
import { useEffect, useState } from "react"

import { capitalize } from "~/shared"
import { Button } from "~/shared/ui-kit/button"
import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"
import { Small } from "~/shared/ui/Typography"
import { useHeader, Tab } from "~/widgets/header/model"

export * from "./model"

export function Header() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const { activeTab } = useHeader()
  const tabs: Tab[] = ["home", "support", "features", "benefits", "pricing"]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 py-3 transition-colors ${isScrolled ? "bg-white shadow-sm" : ""}`}>
      <Container className="flex items-center justify-between">
        <Logo />
        <nav>
          <ul className="flex list-none items-center gap-8">
            {tabs.map((tab) => (
              <li key={tab}>
                <Small
                  as="a"
                  href={`#${tab}`}
                  className={`transition-colors ${tab === activeTab ? "text-black" : "text-grayish"}`}>
                  {capitalize(tab)}
                </Small>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-6">
          <SignInButton>
            <Small as="a" href="#">
              Login
            </Small>
          </SignInButton>
          <SignUpButton>
            <Button size="sm">Sign up</Button>
          </SignUpButton>
        </div>
      </Container>
    </header>
  )
}

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react"
import { MenuIcon, PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { capitalize, cn } from "~/shared/lib"
import { Button } from "~/shared/ui-kit/button"
import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"
import { Small } from "~/shared/ui/Typography"
import { useHeader, Tab } from "~/widgets/header/model"

export * from "./model"

const tabs: Tab[] = ["home", "support", "features", "benefits", "pricing"]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { activeTab } = useHeader()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const switchIsMenuOpen = (value: boolean) => {
    if (value) {
      setIsMenuOpen(true)
      // Disabling scrolling for body when menu is open
      document.body.style.overflow = "hidden"
    } else {
      setIsMenuOpen(false)
      document.body.style.overflow = ""
    }
  }

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 py-3 transition-colors max-md:py-2.5",
        isScrolled ? "bg-white shadow-sm" : "",
      )}>
      <Container className="flex items-center justify-between">
        {/* Burger open button */}
        <div className="flex flex-1 items-center gap-2 max-md:gap-4">
          <button
            type="button"
            className="hidden h-6 w-6 items-center justify-center max-md:flex"
            onClick={() => switchIsMenuOpen(true)}>
            <MenuIcon className="h-full w-full text-black" />
          </button>
          <Logo className="max-lg:!h-10 max-lg:!w-10" />
        </div>
        {/* Dark background */}
        <div
          className={cn(
            "fixed left-0 top-0 z-30 hidden h-full w-full bg-black opacity-80 transition-colors max-md:block",
            isMenuOpen ? "visible opacity-80" : "invisible opacity-0",
          )}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={() => switchIsMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              switchIsMenuOpen(false)
            }
          }}
        />
        <div
          className={cn(
            "flex-2 flex h-full items-center justify-between gap-10 transition-transform max-md:fixed max-md:left-0 max-md:top-0 max-md:z-40 max-md:w-64 max-md:flex-col max-md:overflow-y-scroll max-md:bg-white max-md:p-3",
            isMenuOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          )}>
          {/* Burger close button */}
          <div className="hidden w-full justify-end max-md:flex">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center"
              onClick={() => switchIsMenuOpen(false)}>
              <PlusIcon className="h-full w-full rotate-45" />
            </button>
          </div>
          <nav>
            <ul className="flex list-none items-center gap-8 max-lg:gap-6 max-md:flex-col max-md:gap-4">
              {tabs.map((tab) => (
                <li key={tab}>
                  <Small
                    as="a"
                    href={`#${tab}`}
                    className={cn(
                      "transition-colors max-md:text-base",
                      tab === activeTab ? "text-black" : "text-grayish",
                    )}
                    onClick={() => switchIsMenuOpen(false)}>
                    {capitalize(tab)}
                  </Small>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-6 max-lg:gap-4 max-md:w-full">
            <SignedIn>
              <Button asChild size="sm" variant="outline" className="font-semibold max-md:w-full">
                <Link to="/home">/ home</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Small as="a" href="#" className="text-center max-md:w-full">
                  Login
                </Small>
              </SignInButton>
              <SignUpButton>
                <Button size="sm" className="max-md:w-full">
                  Sign up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </Container>
    </header>
  )
}

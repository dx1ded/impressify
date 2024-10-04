import { UserButton } from "@clerk/clerk-react"

import { SearchPresentations } from "~/features/search-presentations"
import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"

export function Header() {
  return (
    <header className="py-3 max-lg:py-2">
      <Container className="flex items-center justify-between gap-5 max-sm:flex-wrap max-sm:gap-2">
        <div className="basis-56 max-md:basis-10">
          <Logo size={2.5} textClassName="max-lg:text-base max-md:hidden" />
        </div>
        <SearchPresentations />
        <div className="flex basis-56 items-center justify-end max-md:basis-10 max-md:[&_.cl-avatarBox]:h-8 max-md:[&_.cl-avatarBox]:w-8 max-lg:[&_.cl-userButtonOuterIdentifier]:hidden">
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox: { gap: "0.8rem" },
                userButtonOuterIdentifier: { fontSize: "0.85rem" },
                userButtonAvatarBox: { width: "2.1rem", height: "2.1rem" },
              },
            }}
          />
        </div>
      </Container>
    </header>
  )
}

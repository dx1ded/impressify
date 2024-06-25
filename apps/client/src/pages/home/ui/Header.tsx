import { UserButton } from "@clerk/clerk-react"

import { SearchPresentations } from "~/features/search-presentations"
import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"

export function Header() {
  return (
    <header className="py-3">
      <Container className="grid grid-cols-3 items-center gap-5">
        <Logo size={2.5} />
        <SearchPresentations />
        <div className="flex items-center justify-end">
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

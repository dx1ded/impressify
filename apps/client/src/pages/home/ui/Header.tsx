import { UserButton } from "@clerk/clerk-react"
import { Search } from "lucide-react"

import { Input } from "~/shared/ui-kit/input"
import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"

export function Header() {
  return (
    <header className="py-3">
      <Container className="grid grid-cols-3 items-center gap-5">
        <Logo size={2.5} />
        <div className="relative">
          <Input className="pr-11" placeholder="Search" />
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
        </div>
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

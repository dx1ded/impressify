import { UserButton } from "@clerk/clerk-react"
import { useDebouncedCallback } from "use-debounce"

import { MAX_NAME_LENGTH, setName } from "~/entities/presentation"
import { Menubar } from "~/pages/presentation/ui/Menubar"
import { SavingIcon } from "~/pages/presentation/ui/SavingIcon"
import { useAppDispatch } from "~/shared/model"
import { Button } from "~/shared/ui-kit/button"
import { Logo } from "~/shared/ui/Logo"
import { ResizableInput } from "~/shared/ui/ResizableInput"

const DEBOUNCED_CHANGE_NAME_TIME = 2000

export function Header() {
  const dispatch = useAppDispatch()

  const debouncedChangeName = useDebouncedCallback((value: string) => {
    dispatch(setName(value))
  }, DEBOUNCED_CHANGE_NAME_TIME)

  return (
    <header className="flex items-center justify-between py-2">
      <div className="flex items-start gap-1.5">
        <Logo noText size={3.25} url="/home" />
        <div>
          <div className="flex items-center gap-3">
            <ResizableInput maxLength={MAX_NAME_LENGTH}>
              <input
                type="text"
                className="rounded border border-transparent bg-transparent px-1 py-0.5 font-medium hover:border-gray-300"
                defaultValue="Inquiry Assignment - Before Reading"
                data-toast="Presentation name"
                onChange={(e) => debouncedChangeName(e.target.value)}
              />
            </ResizableInput>
            <SavingIcon />
          </div>
          <Menubar />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="outline" className="rounded-3xl px-6 font-semibold">
          Slideshow
        </Button>
        <Button variant="blue" className="rounded-3xl px-6 font-semibold">
          Share
        </Button>
        <UserButton appearance={{ elements: { userButtonAvatarBox: { width: "2rem", height: "2rem" } } }} />
      </div>
    </header>
  )
}

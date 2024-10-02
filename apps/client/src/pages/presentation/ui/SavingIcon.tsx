import { CheckCheckIcon, LoaderCircleIcon } from "lucide-react"

import { useAppSelector } from "~/shared/model"

export function SavingIcon() {
  const isSaving = useAppSelector((state) => state.presentation.isSaving)

  return isSaving ? (
    <LoaderCircleIcon className="text-grayish h-4 w-4 animate-spin" />
  ) : (
    <CheckCheckIcon className="text-grayish h-4 w-4" />
  )
}

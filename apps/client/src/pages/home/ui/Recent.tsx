import { SortPresentations } from "features/sort-presentations"

import { PresentationPreview } from "~/entities/presentation"
import { Container } from "~/shared/ui/Container"
import { Text } from "~/shared/ui/Typography"

export function Recent() {
  return (
    <div className="py-6">
      <Container>
        <div className="mb-5 flex items-center justify-between">
          <Text className="font-semibold">Recent presentations</Text>
          <SortPresentations />
        </div>
        <div className="grid grid-cols-5 gap-4">
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
          <PresentationPreview />
        </div>
      </Container>
    </div>
  )
}

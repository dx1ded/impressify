import { Templates } from "~/pages/home/ui/Templates"
import { Container } from "~/shared/ui/Container"
import { Text } from "~/shared/ui/Typography"

export function CreateNew() {
  return (
    <div className="bg-secondary pb-8 pt-5">
      <Container>
        <Text className="mb-4 font-medium">Start a new presentation</Text>
        <Templates />
      </Container>
    </div>
  )
}

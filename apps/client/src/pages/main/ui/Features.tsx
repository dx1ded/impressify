import { SignUpButton } from "@clerk/clerk-react"
import { useInView } from "react-intersection-observer"

import { Button } from "~/shared/ui-kit/button"
import { Container } from "~/shared/ui/Container"
import { Heading, Lead, Subheading } from "~/shared/ui/Typography"
import CollaborationIllustration from "~/assets/collaboration-illustration.svg"
import StorageIllustration from "~/assets/storage-illustration.svg"
import PerformanceIllustration from "~/assets/performance-illustration.svg"
import { useHeader } from "~/widgets/header"

export function Features() {
  const { setActiveTab } = useHeader()

  const { ref } = useInView({
    threshold: 1,
    onChange(inView) {
      if (!inView) return
      setActiveTab("features")
    },
  })

  return (
    <section ref={ref} className="bg-white py-24" id="features">
      <Container>
        <div className="mb-16 flex items-center justify-between">
          <Heading className="basis-80">Our Features you can get</Heading>
          <Lead className="text-grayish basis-[28.75rem]">
            We offer a variety of interesting features that you can help increase yor productivity at work and manage
            your projrct esaly
          </Lead>
          <SignUpButton>
            <Button size="lg" className="rounded-3xl">
              Get started
            </Button>
          </SignUpButton>
        </div>
        <div className="grid grid-cols-3 gap-10">
          <div>
            <img src={CollaborationIllustration} className="mb-8 w-full" alt="Collaboration" />
            <Subheading>Collaboration Teams</Subheading>
            <Lead className="text-grayish">Here you can handle projects together with team virtually</Lead>
          </div>
          <div>
            <img src={StorageIllustration} className="mb-8 w-full" alt="Storage" />
            <Subheading>Cloud Storage</Subheading>
            <Lead className="text-grayish">No need to worry about storage because we provide storage up to 2 TB</Lead>
          </div>
          <div>
            <img src={PerformanceIllustration} className="mb-8 w-full" alt="Perfomance" />
            <Subheading>Performance</Subheading>
            <Lead className="text-grayish">
              We always try to optimize our application and make the performance better
            </Lead>
          </div>
        </div>
      </Container>
    </section>
  )
}

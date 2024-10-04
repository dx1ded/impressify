import { SignUpButton } from "@clerk/clerk-react"
import { useInView } from "react-intersection-observer"

import { Button } from "~/shared/ui-kit/button"
import { Container } from "~/shared/ui/Container"
import { Heading, Lead, Subheading } from "~/shared/ui/Typography"
import { useHeader } from "~/widgets/header"
import CollaborationIllustration from "~/assets/collaboration-illustration.svg"
import StorageIllustration from "~/assets/storage-illustration.svg"
import PerformanceIllustration from "~/assets/performance-illustration.svg"

export function Features() {
  const { setActiveTab } = useHeader()

  const { ref } = useInView({
    threshold: 0.5,
    onChange(inView) {
      if (!inView) return
      setActiveTab("features")
    },
  })

  return (
    <section ref={ref} className="max-xs:py-10 bg-white py-24 max-xl:py-16 max-md:py-12" id="features">
      <Container>
        <div className="max-xs:mb-10 mb-16 flex items-center justify-between gap-4 max-md:mb-12 max-md:flex-col">
          <Heading className="basis-80 max-md:basis-auto max-md:text-center">Our Features you can get</Heading>
          <Lead className="text-grayish basis-[28.75rem] max-md:max-w-[30rem] max-md:basis-auto max-md:text-center">
            We offer a variety of interesting features that you can help increase yor productivity at work and manage
            your projrct esaly
          </Lead>
          <SignUpButton>
            <Button size="lg" className="rounded-3xl">
              Get started
            </Button>
          </SignUpButton>
        </div>
        <div className="max-xs:grid-cols-1 grid grid-cols-3 gap-10 max-md:gap-4 max-sm:grid-cols-2">
          <div>
            <img src={CollaborationIllustration} className="mb-8 w-full max-md:mb-6" alt="Collaboration" />
            <Subheading>Collaboration Teams</Subheading>
            <Lead className="text-grayish">Here you can handle projects together with team virtually</Lead>
          </div>
          <div>
            <img src={StorageIllustration} className="mb-8 w-full max-md:mb-6" alt="Storage" />
            <Subheading>Cloud Storage</Subheading>
            <Lead className="text-grayish">No need to worry about storage because we provide storage up to 2 TB</Lead>
          </div>
          <div>
            <img src={PerformanceIllustration} className="mb-8 w-full max-md:mb-6" alt="Perfomance" />
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

import { useInView } from "react-intersection-observer"

import { useHeader } from "~/widgets/header"
import { Checkmark } from "~/shared/ui/Checkmark"
import { Container } from "~/shared/ui/Container"
import { Heading, Lead } from "~/shared/ui/Typography"
import LaptopPicture from "~/assets/laptop-picture.png"

export function Benefits() {
  const { setActiveTab } = useHeader()

  const { ref } = useInView({
    threshold: 0.5,
    onChange(inView) {
      if (!inView) return
      setActiveTab("benefits")
    },
  })

  return (
    <section
      ref={ref}
      className="max-xl:py-18 py-20 max-lg:py-14 max-md:py-12 max-sm:py-10"
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,1), rgba(254,223,212,1) 100%)" }}
      id="benefits">
      <Container className="flex justify-between gap-8 max-md:items-center">
        <div className="basis-[28rem]">
          <Heading className="mb-12 max-lg:mb-8">What Benefits Will You Get</Heading>
          <div className="grid gap-6">
            <div className="flex items-center gap-5 max-lg:gap-4">
              <Checkmark className="h-8 w-8 max-md:h-6 max-md:w-6" />
              <Lead className="font-medium">Easy Collaboration With Team</Lead>
            </div>
            <div className="flex items-center gap-5 max-lg:gap-4">
              <Checkmark className="h-8 w-8 max-md:h-6 max-md:w-6" />
              <Lead className="font-medium">Real-Time Editing</Lead>
            </div>
            <div className="flex items-center gap-5 max-lg:gap-4">
              <Checkmark className="h-8 w-8 max-md:h-6 max-md:w-6" />
              <Lead className="font-medium">Customizable Templates</Lead>
            </div>
            <div className="flex items-center gap-5 max-lg:gap-4">
              <Checkmark className="h-8 w-8 max-md:h-6 max-md:w-6" />
              <Lead className="font-medium">Cloud Storage Integration</Lead>
            </div>
            <div className="flex items-center gap-5 max-lg:gap-4">
              <Checkmark className="h-8 w-8 max-md:h-6 max-md:w-6" />
              <Lead className="font-medium">Cross-Device Accessibility</Lead>
            </div>
          </div>
        </div>
        <div className="relative basis-[28rem] max-lg:basis-[24rem] max-sm:hidden">
          <img src={LaptopPicture} className="w-full" alt="Laptop on the table" />
        </div>
      </Container>
    </section>
  )
}

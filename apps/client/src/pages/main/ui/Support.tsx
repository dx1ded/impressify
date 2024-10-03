import { LineChart, Star, PieChart, Command } from "lucide-react"
import { useInView } from "react-intersection-observer"

import { Container } from "~/shared/ui/Container"
import { Heading, Lead, Subheading, Text } from "~/shared/ui/Typography"
import { useHeader } from "~/widgets/header"

export function Support() {
  const { setActiveTab } = useHeader()

  const { ref } = useInView({
    threshold: 0.5,
    onChange(inView) {
      if (!inView) return
      setActiveTab("support")
    },
  })

  return (
    <section ref={ref} className="bg-selago py-16 max-xl:py-12 max-lg:py-10" id="support">
      <Container className="flex justify-between gap-7 max-md:flex-col max-md:gap-12">
        <div className="max-w-[40rem]">
          <Heading className="mb-8 max-xl:mb-6 max-lg:mb-4 max-md:max-w-[32rem]">
            How we support our users all over the world
          </Heading>
          <Text className="text-grayish mb-16 max-xl:mb-12 max-lg:mb-8 max-md:mb-6 max-md:max-w-[36rem]">
            SaaS become a common delivery model for many business application, including office software, messaging
            software, payroll processing software, DBMS software, management software
          </Text>
          <div className="flex gap-20 max-lg:gap-12 max-md:gap-8">
            <div className="flex flex-col gap-4 max-lg:gap-2">
              <div className="flex gap-1">
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
              </div>
              <p className="text-lg max-lg:text-base">
                <span className="font-bold">4.9</span> / 5 rating
              </p>
              <p className="text-grayish text-lg font-bold max-lg:text-base">databricks</p>
            </div>
            <div className="flex flex-col gap-4 max-lg:gap-2">
              <div className="flex gap-1">
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-yellow-400 max-lg:h-6 max-lg:w-6" />
                <Star className="h-8 w-8 text-gray-200 max-lg:h-6 max-lg:w-6" />
              </div>
              <p className="text-lg max-lg:text-base">
                <span className="font-bold">4.8</span> / 5 rating
              </p>
              <p className="text-grayish text-lg font-semibold max-lg:text-base">Chainalysis</p>
            </div>
          </div>
        </div>
        <div className="grid flex-shrink-0 gap-8 max-xl:gap-6">
          <div className="flex items-start gap-5">
            <div className="text-primary flex h-16 w-16 flex-shrink-0 items-center justify-center bg-white shadow-lg max-xl:h-14 max-xl:w-14 max-lg:h-12 max-lg:w-12">
              <LineChart className="h-8 w-8 max-xl:h-6 max-xl:w-6" />
            </div>
            <div>
              <Subheading>Publishing</Subheading>
              <Lead className="text-grayish max-w-[26.75rem] max-lg:max-w-[20rem] max-md:max-w-[34rem]">
                Plan, collaborate, and publishing your contetn that drivees meaningful engagement and growth for your
                barnd
              </Lead>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="text-primary flex h-16 w-16 flex-shrink-0 items-center justify-center bg-white shadow-lg max-xl:h-14 max-xl:w-14 max-lg:h-12 max-lg:w-12">
              <PieChart className="h-8 w-8 max-xl:h-6 max-xl:w-6" />
            </div>
            <div>
              <Subheading>Analytics</Subheading>
              <Lead className="text-grayish max-w-[26.75rem] max-lg:max-w-[20rem] max-md:max-w-[34rem]">
                Analyze your performance and create goegeous report
              </Lead>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="text-primary flex h-16 w-16 flex-shrink-0 items-center justify-center bg-white shadow-lg max-xl:h-14 max-xl:w-14 max-lg:h-12 max-lg:w-12">
              <Command className="h-8 w-8 max-xl:h-6 max-xl:w-6" />
            </div>
            <div>
              <Subheading>Engagement</Subheading>
              <Lead className="text-grayish max-w-[26.75rem] max-lg:max-w-[20rem] max-md:max-w-[34rem]">
                Quiuckly navigate you anda engage with your adience
              </Lead>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

import { LineChart, Star, PieChart, Command } from "lucide-react"
import { useInView } from "react-intersection-observer"

import { Container } from "~/shared/ui/Container"
import { Heading, Lead, Subheading, Text } from "~/shared/ui/Typography"
import { useHeader } from "~/widgets/header"

export function Support() {
  const { setActiveTab } = useHeader()

  const { ref } = useInView({
    threshold: 1,
    onChange(inView) {
      if (!inView) return
      setActiveTab("support")
    },
  })

  return (
    <section ref={ref} className="bg-selago py-16" id="support">
      <Container className="flex justify-between gap-7">
        <div className="max-w-[40rem]">
          <Heading className="mb-8">How we support our users all over the world</Heading>
          <Text className="text-grayish mb-16">
            SaaS become a common delivery model for many business application, including office software, messaging
            software, payroll processing software, DBMS software, management software
          </Text>
          <div className="flex gap-20">
            <div className="flex flex-col gap-4">
              <div className="flex gap-1">
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-yellow-400" width="2rem" height="2rem" />
              </div>
              <p className="text-lg">
                <span className="font-bold">4.9</span> / 5 rating
              </p>
              <p className="text-grayish text-lg font-bold">databricks</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-1">
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-yellow-400" width="2rem" height="2rem" />
                <Star className="text-gray-200" width="2rem" height="2rem" />
              </div>
              <p className="text-lg">
                <span className="font-bold">4.8</span> / 5 rating
              </p>
              <p className="text-grayish text-lg font-semibold">Chainalysis</p>
            </div>
          </div>
        </div>
        <div className="grid gap-8">
          <div className="flex items-start gap-5">
            <div className="text-primary flex h-16 w-16 items-center justify-center bg-white shadow-lg">
              <LineChart width="2rem" height="2rem" />
            </div>
            <div>
              <Subheading className="!font-bold !tracking-normal">Publishing</Subheading>
              <Lead className="text-grayish max-w-[26.75rem]">
                Plan, collaborate, and publishing your contetn that drivees meaningful engagement and growth for your
                barnd
              </Lead>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="text-primary flex h-16 w-16 items-center justify-center bg-white shadow-lg">
              <PieChart width="2rem" height="2rem" />
            </div>
            <div>
              <Subheading className="!font-bold !tracking-normal">Analytics</Subheading>
              <Lead className="text-grayish max-w-[26.75rem]">Analyze your performance and create goegeous report</Lead>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="text-primary flex h-16 w-16 items-center justify-center bg-white shadow-lg">
              <Command width="2rem" height="2rem" />
            </div>
            <div>
              <Subheading className="!font-bold !tracking-normal">Engagement</Subheading>
              <Lead className="text-grayish max-w-[26.75rem]">Quiuckly navigate you anda engage with your adience</Lead>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

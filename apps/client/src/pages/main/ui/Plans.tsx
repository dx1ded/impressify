import { SignUpButton } from "@clerk/clerk-react"
import { useInView } from "react-intersection-observer"

import { Button } from "~/shared/ui-kit/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui-kit/tabs"
import { Checkmark } from "~/shared/ui/Checkmark"
import { Container } from "~/shared/ui/Container"
import { Heading, Lead, Subheading } from "~/shared/ui/Typography"
import { useHeader } from "~/widgets/header"

export function Plans() {
  const { setActiveTab } = useHeader()

  const { ref } = useInView({
    threshold: 0.5,
    onChange(inView) {
      if (!inView) return
      setActiveTab("pricing")
    },
  })

  return (
    <section
      ref={ref}
      className="py-20 max-xl:py-16 max-lg:py-12 max-md:py-10"
      style={{
        background: "linear-gradient(180deg, rgba(254,223,212,1) 0%, rgba(255,255,255,1) 100%)",
      }}
      id="pricing">
      <Container className="flex flex-col items-center">
        <Heading className="mb-9 max-w-[30rem] text-center max-xl:mb-7">Choose Plan That&apos;s Right For You</Heading>
        <Lead className="text-grayish mb-9 text-center max-xl:mb-7">
          Choose plan that works best for you, fell free to contact us
        </Lead>
        <Tabs defaultValue="yearly" className="w-full">
          <div className="mb-16 flex justify-center max-sm:mb-12">
            <TabsList className="grid w-80 grid-cols-2 justify-center">
              <TabsTrigger value="monthly">Bill Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Bill Yearly</TabsTrigger>
            </TabsList>
          </div>
          <div className="grid grid-cols-3 gap-9 max-xl:gap-6 max-lg:grid-cols-2 max-lg:gap-4 max-sm:grid-cols-1">
            <div className="flex flex-col items-center rounded-3xl bg-white px-5 py-9 text-center shadow-lg max-xl:px-3 max-xl:pb-3 max-xl:pt-6">
              <Subheading>Free</Subheading>
              <Lead className="text-grayish mx-auto mb-8 max-w-52">Have a go and test your superpowers</Lead>
              <p className="before:text-grayish relative mb-7 inline-block text-5xl font-semibold before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:content-['$'] max-xl:mb-5">
                0
              </p>
              <div className="mt-auto w-full rounded-xl bg-[#F9FAFB] px-8 py-6 text-left max-xl:px-5 max-xl:py-4 max-md:px-4">
                <div className="mb-9 grid gap-6 max-xl:mb-6 max-xl:gap-4">
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">2 Users</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">2 Files</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Public Share & Comments</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Chat Support</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">New income apps</Lead>
                  </div>
                </div>
                <SignUpButton>
                  <Button
                    variant="default-inverted"
                    className="w-full rounded-2xl py-7 text-lg font-semibold shadow-md">
                    Sign up for free
                  </Button>
                </SignUpButton>
              </div>
            </div>
            <div className="bg-primary flex flex-col items-center rounded-3xl px-5 py-9 text-center shadow-lg max-xl:px-3 max-xl:pb-3 max-xl:pt-6">
              <Subheading className="text-white">Pro</Subheading>
              <Lead className="mx-auto mb-8 max-w-52 text-white">Experiment the power of infinite possibilities</Lead>
              <TabsContent asChild value="monthly">
                <p className="relative mb-7 inline-block text-5xl font-semibold text-white before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:text-white before:content-['$'] max-xl:mb-5">
                  12
                </p>
              </TabsContent>
              <TabsContent asChild value="yearly">
                <p className="relative mb-7 inline-block text-5xl font-semibold text-white before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:text-white before:content-['$'] max-xl:mb-5">
                  8
                </p>
              </TabsContent>
              <div className="mt-auto w-full rounded-xl bg-white px-8 py-6 text-left max-xl:px-5 max-xl:py-4 max-md:px-4">
                <div className="mb-9 grid gap-6 max-xl:mb-6 max-xl:gap-4">
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">4 Users</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">All apps</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Unlimited editable exports</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Folders and collaboration </Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">All incoming apps</Lead>
                  </div>
                </div>
                <SignUpButton>
                  <Button className="w-full rounded-2xl py-7 text-lg font-semibold shadow-md">Go to pro</Button>
                </SignUpButton>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-3xl bg-white px-5 py-9 text-center shadow-lg max-xl:px-3 max-xl:pb-3 max-xl:pt-6">
              <Subheading>Business</Subheading>
              <Lead className="text-grayish mx-auto mb-8 max-w-52">Unveil new superpowers and join the League</Lead>
              <TabsContent asChild value="monthly">
                <p className="before:text-grayish relative mb-7 inline-block text-5xl font-semibold before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:content-['$'] max-xl:mb-5">
                  20
                </p>
              </TabsContent>
              <TabsContent asChild value="yearly">
                <p className="before:text-grayish relative mb-7 inline-block text-5xl font-semibold before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:content-['$'] max-xl:mb-5">
                  16
                </p>
              </TabsContent>
              <div className="mt-auto w-full rounded-xl bg-[#F9FAFB] px-8 py-6 text-left max-xl:px-5 max-xl:py-4 max-md:px-4">
                <div className="mb-9 grid gap-6 max-xl:mb-6 max-xl:gap-4">
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">All the features of pro plan</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Account success Manager</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Single Sign-On (SSO)</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Co-conception program</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark className="h-6 w-6" />
                    <Lead className="font-semibold">Collaboration-Soon</Lead>
                  </div>
                </div>
                <SignUpButton>
                  <Button
                    variant="default-inverted"
                    className="w-full rounded-2xl py-7 text-lg font-semibold shadow-md">
                    Go to Business
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </Tabs>
      </Container>
    </section>
  )
}

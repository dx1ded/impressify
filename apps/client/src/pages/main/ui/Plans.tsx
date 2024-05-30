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
    threshold: 1,
    onChange(inView) {
      if (!inView) return
      setActiveTab("pricing")
    },
  })

  return (
    <section
      ref={ref}
      className="py-20"
      style={{
        background: "linear-gradient(180deg, rgba(254,223,212,1) 0%, rgba(255,255,255,1) 100%)",
      }}
      id="pricing">
      <Container className="flex flex-col items-center">
        <Heading className="mb-9 max-w-[30rem] text-center">Choose Plan That&apos;s Right For You</Heading>
        <Lead className="text-grayish mb-9 text-center">
          Choose plan that works best for you, fell free to contact us
        </Lead>
        <Tabs defaultValue="yearly" className="w-full">
          <div className="flex justify-center">
            <TabsList className="mb-16 grid w-80 grid-cols-2 justify-center">
              <TabsTrigger value="monthly">Bill Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Bill Yearly</TabsTrigger>
            </TabsList>
          </div>
          <div className="grid grid-cols-3 gap-9">
            <div className="rounded-3xl bg-white px-5 py-9 text-center shadow-lg">
              <Subheading>Free</Subheading>
              <Lead className="text-grayish mx-auto mb-8 max-w-52">Have a go and test your superpowers</Lead>
              <p className="before:text-grayish relative mb-7 inline-block text-5xl font-semibold before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:content-['$']">
                0
              </p>
              <div className="rounded-xl bg-[#F9FAFB] px-8 py-6">
                <div className="mb-9 grid gap-6">
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">2 Users</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">2 Files</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">Public Share & Comments</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">Chat Support</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
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
            <div className="bg-primary rounded-3xl px-5 py-9 text-center shadow-lg">
              <Subheading className="text-white">Pro</Subheading>
              <Lead className="mx-auto mb-8 max-w-52 text-white">Experiment the power of infinite possibilities</Lead>
              <TabsContent asChild value="monthly">
                <p className="relative mb-7 inline-block text-5xl font-semibold text-white before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:text-white before:content-['$']">
                  12
                </p>
              </TabsContent>
              <TabsContent asChild value="yearly">
                <p className="relative mb-7 inline-block text-5xl font-semibold text-white before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:text-white before:content-['$']">
                  8
                </p>
              </TabsContent>
              <div className="rounded-xl bg-white px-8 py-6">
                <div className="mb-9 grid gap-6">
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">4 Users</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">All apps</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">Unlimited editable exports</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">Folders and collaboration </Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">All incoming apps</Lead>
                  </div>
                </div>
                <SignUpButton>
                  <Button className="w-full rounded-2xl py-7 text-lg font-semibold shadow-md">Go to pro</Button>
                </SignUpButton>
              </div>
            </div>
            <div className="rounded-3xl bg-white px-5 py-9 text-center shadow-lg">
              <Subheading>Business</Subheading>
              <Lead className="text-grayish mx-auto mb-8 max-w-52">Unveil new superpowers and join the League</Lead>
              <TabsContent asChild value="monthly">
                <p className="before:text-grayish relative mb-7 inline-block text-5xl font-semibold before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:content-['$']">
                  20
                </p>
              </TabsContent>
              <TabsContent asChild value="yearly">
                <p className="before:text-grayish relative mb-7 inline-block text-5xl font-semibold before:absolute before:left-0 before:top-0 before:-translate-x-full before:-translate-y-1/2 before:text-xl before:content-['$']">
                  16
                </p>
              </TabsContent>
              <div className="rounded-xl bg-[#F9FAFB] px-8 py-6">
                <div className="mb-9 grid gap-6">
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">All the features of pro plan</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">Account success Manager</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">Single Sign-On (SSO)</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
                    <Lead className="font-semibold">Co-conception program</Lead>
                  </div>
                  <div className="flex items-center gap-4">
                    <Checkmark width={1.625} height={1.625} />
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

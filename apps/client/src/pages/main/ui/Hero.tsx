import { SignInButton } from "@clerk/clerk-react"
import { useInView } from "react-intersection-observer"

import { Button } from "~/shared/ui-kit/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { Container } from "~/shared/ui/Container"
import { Heading, Lead } from "~/shared/ui/Typography"
import { useHeader } from "~/widgets/header"
import HeroPersonImage from "~/assets/hero-person.png"
import PlayVideoIcon from "~/assets/play-video-icon.svg"
import DatabaseIcon from "~/assets/database-icon.svg"
import CheckIcon from "~/assets/check-icon.svg"
import MessageIcon from "~/assets/message-icon.svg"

export function Hero() {
  const { setActiveTab } = useHeader()

  const { ref } = useInView({
    threshold: 0.5,
    onChange(inView) {
      if (!inView) return
      setActiveTab("home")
    },
  })

  return (
    <main
      ref={ref}
      className="flex h-[64rem] items-center"
      style={{
        background: "linear-gradient(175deg, rgba(254,209,194,1) 0%, rgba(255,255,255,1) 93%)",
      }}
      id="home">
      <Container className="flex items-center justify-between gap-6">
        <div>
          <Heading className="mb-8 max-w-xl lg:text-7xl">We&apos;re here to Increase your Productivity</Heading>
          <svg width="100%" height={34} fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-12">
            <path
              d="M4 30C73.6307 10.3798 266.914 -17.0885 483 30"
              stroke="#F96C3B"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          <Lead className="mb-10 max-w-lg font-medium">
            Let&apos;s make your work more organize and easily using the Impressify Slides with many of the latest
            features in managing work every day.
          </Lead>
          <div className="flex items-center gap-9">
            <SignInButton>
              <Button size="lg" className="rounded-3xl">
                Try for free
              </Button>
            </SignInButton>
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className="flex items-center gap-3">
                  <img src={PlayVideoIcon} className="h-10 w-10" alt="" aria-hidden />
                  View Demo
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[57.5rem]">
                <DialogHeader>
                  <DialogTitle hidden>Video about Impressify</DialogTitle>
                  <DialogDescription hidden>Watch a video about what Impressify is</DialogDescription>
                </DialogHeader>
                <iframe
                  className="aspect-video w-full"
                  src="https://www.youtube.com/embed/nz43Vuy9_dE?si=0ByIiprljcCqH3jv"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="relative max-w-[25rem]">
          <img src={HeroPersonImage} className="w-full" alt="Person showing like" />
          <img src={DatabaseIcon} className="absolute -right-10 top-8 h-20 w-20" alt="" aria-hidden />
          <img src={CheckIcon} className="absolute -left-12 top-32 h-20 w-20" alt="" aria-hidden />
          <img src={MessageIcon} className="absolute -bottom-12 right-8 h-20 w-20" alt="" aria-hidden />
        </div>
      </Container>
    </main>
  )
}

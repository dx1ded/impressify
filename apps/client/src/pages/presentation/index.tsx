import { Slide } from "~/pages/presentation/ui/Slide"
import { SlideList } from "~/pages/presentation/ui/SlideList"
import { Toolbar } from "~/pages/presentation/ui/Toolbar"
import { Header } from "~/pages/presentation/ui/Header"
import { Toaster } from "~/shared/ui-kit/sonner"
import { TooltipProvider } from "~/shared/ui-kit/tooltip"

export default function Presentation() {
  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-[#f8fafd] px-4">
        <div>
          <Header />
          <Toolbar />
        </div>
        <div className="flex min-h-[56rem] flex-1 gap-4">
          <SlideList />
          <Slide />
        </div>
      </div>
      {/* To use <ResizableInput/> */}
      <Toaster />
    </TooltipProvider>
  )
}

import { StrictMode, Suspense } from "react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { Loader } from "~/shared/ui/Loader"

import { App } from "./app"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)

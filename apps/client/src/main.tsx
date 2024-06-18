import { StrictMode, Suspense } from "react"
import * as ReactDOM from "react-dom/client"
import { App } from "app"
import { BrowserRouter } from "react-router-dom"

import { Loader } from "~/shared/ui/Loader"

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

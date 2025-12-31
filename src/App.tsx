import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import { ThemeProvider } from "./common/theme-provider"

const App = () => {
  return (
    <div className="">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  )
}

export default App

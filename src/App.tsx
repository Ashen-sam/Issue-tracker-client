import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { router } from "./routes";
import { ThemeProvider } from "./common/theme-provider";
import { store } from "./store";
import { Toaster } from "sonner";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
        />
      </ThemeProvider>
    </Provider>
  );
};

export default App;

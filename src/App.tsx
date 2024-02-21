import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "@/layout/Root";
import HeroPage from "./page/Hero";
import { ThemeProvider } from "./hooks/useTheme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HeroPage />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme='light' enableSystem storageKey='ducky-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "@/layout/Root";
import HeroPage from "./page/Hero";
import { ThemeProvider } from "./hooks/useTheme";
import StoragePage from "./page/Storage";

const router = createBrowserRouter([
  {
    // 메인 페이지
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HeroPage />,
      },
    ],
  },
  {
    // 저장소 페이지
    path: "/storage",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <StoragePage />,
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

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

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

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='light' enableSystem storageKey='ducky-theme'>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

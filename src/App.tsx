import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import RootLayout from "@/layout/Root";
import AuthLayout from "./layout/Auth";
import HeroPage from "./page/Hero";
import { ThemeProvider } from "./hooks/useTheme";
import StoragePage from "./page/Storage";
import LoginPage from "./page/Login";
import RegisterPage from "./page/Register";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true, // 메인 페이지
            element: <HeroPage />,
          },
          {
            path: "storage", // 저장소 페이지
            element: <StoragePage />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
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

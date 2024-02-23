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

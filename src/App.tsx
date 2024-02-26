import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import RootLayout from "@/layout/Root";
import AuthLayout from "./layout/Auth";
import ErrorPage from "./page/Error";
import HeroPage from "./page/Hero";
import { ThemeProvider } from "./hooks/useTheme";
import StoragePage from "./page/Storage";
import LoginPage from "./page/Login";
import RegisterPage from "./page/Register";
import PostsPage from "./page/Posts";
import PostEditPage from "./page/PostEdit";
import PostPage from "./page/Post";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootLayout outlet={<ErrorPage />} />,
    children: [
      {
        index: true, // 메인 페이지
        element: <HeroPage />,
      },
      {
        path: "storage", // 저장소 페이지
        element: <StoragePage />,
      },
      {
        path: "posts", // 글 페이지
        children: [
          {
            index: true,
            element: <PostsPage />,
          },
          {
            path: "new",
            element: <PostEditPage />,
          },
          {
            path: "category/:categoryId",
            element: <PostsPage />,
          },
          {
            path: ":postId",
            element: <PostPage />,
          },
        ],
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

import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { AboutUs } from "./components/AboutUs";
import { AuthPage } from "./components/auth/AuthPage";

export const router = createBrowserRouter([
  // Public auth route
  {
    path: "/auth",
    Component: AuthPage,
  },
  // Protected app shell
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: AboutUs },
    ],
  },
  // Catch-all — loader-based redirect avoids calling hooks outside React
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);

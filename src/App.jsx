import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./layouts/AppLayout";
import Onboarding from "./pages/Onboarding";
import Job from "./pages/Job";
import JobListing from "./pages/JobListing";
import MyJobs from "./pages/MyJobs";
import SavedJobs from "./pages/SavedJobs";
import PostJob from "./pages/PostJob";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRotue from "./components/ProtectedRotue";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRotue>
            <Onboarding />
          </ProtectedRotue>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRotue>
            <Job />
          </ProtectedRotue>
        ),
      },
      {
        path: "/joblisting",
        element: (
          <ProtectedRotue>
            <JobListing />
          </ProtectedRotue>
        ),
      },
      {
        path: "/myjobs",
        element: (
          <ProtectedRotue>
            <MyJobs />
          </ProtectedRotue>
        ),
      },
      {
        path: "/savedjobs",
        element: (
          <ProtectedRotue>
            <SavedJobs />
          </ProtectedRotue>
        ),
      },
      {
        path: "/postjobs",
        element: (
          <ProtectedRotue>
            <PostJob />
          </ProtectedRotue>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;

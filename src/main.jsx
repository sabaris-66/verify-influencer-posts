import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "normalize.css";
// import "./index.css";
// import App from "./App.jsx";
import Dashboard from "./components/Dashboard.jsx";
import InfluencerPage from "./components/InfluencerPage.jsx";
import ResearchPage from "./components/ResearchPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/influencer/:id",
    element: <InfluencerPage />,
  },
  {
    path: "/research",
    element: <ResearchPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

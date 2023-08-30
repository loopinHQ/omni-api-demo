import React from "react";
import ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./index.css";
import SessionDetailPage from "./sessions/SessionDetailPage";
import UserSessionsPage from "./sessions/UserSessionsPage";

const routes = [
  {
    path: "/",
    element: <App contentComponent={UserSessionsPage} />,
  },
  {
    path: "/:id/:sessionId",
    element: <App contentComponent={SessionDetailPage} />,
  },
] as RouteObject[];

const router = createBrowserRouter(routes);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);

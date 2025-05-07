import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Meeting from "./pages/Meeting";
import CreateMeeting from "./pages/CreateMeeting";
import ShareMeeting from "./components/ShareMeeting";
import ParticipantMain from "./pages/ParticipantMain";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/meeting',
    element: <Meeting />,
    children: [
      {
        path: 'create',
        element: <CreateMeeting />,
        children: [
          {
            path: ':creatorId',
            element: <ShareMeeting />,
          },
        ],
      },
      {
        path: 'creator/:creatorId',
        element: <ParticipantMain creator={true} />,
      },
      {
        path: 'participant/:participantId',
        element: <ParticipantMain creator={false} />,
      },
    ],
  },
]);

export default router;
import {
  Error,
  Login,
  MainLayout,
  MarkdownPage,
  MinimalLayout,
} from "@digitalaidseattle/mui";
import { DragAndDropExample } from "./pages/DragAndDropExample";
import CalendarPage from "./pages/calendar/CalendarPage";
import ExcelPage from "./pages/excel/ExcelPage";
import MapPage from "./pages/maps/MapPage";
import StorageExamplePage from "./pages/storage/StorageExamplePage";
import TicketsGrid from "./pages/crud/TicketsPage";
import TicketPage from "./pages/crud/TicketPage";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <div>Home</div>,
      },
      {
        path: "draganddrop",
        element: <DragAndDropExample />,
      },
      {
        path: "maps",
        element: <MapPage />,
      },
      {
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md' />,
      },
      {
        path: "calendar-example",
        element: <CalendarPage />
      },
      {
        path: "excel-example",
        element: <ExcelPage />
      },
      {
        path: "storage-example",
        element: <StorageExamplePage />,
      },
      {
        path: "crud-example",
        element: <TicketsGrid />,
      },
      {
        path: "crud-example/ticket/:id",
        element: <TicketPage />,
      },
    ]
  },
  {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
  {
    path: "*",
    element: <MinimalLayout />,
    children: [
      {
        path: '*',
        element: <Error />
      }
    ]
  }
];

export { routes };

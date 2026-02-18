import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AppLayout from "../layouts/AppLayout";
import Content from "../components/canvas/DashboardCanvas";
import Sidebar from "../components/sidebars/Sidebar";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
      ]}
      sidebarContent={
        <Sidebar
          primaryAction={{
            label: "New Survey",
            icon: <AddIcon />,
            onClick: () => navigate("/surveys/new"),
          }}
        />
      }
    >
      <Content />
    </AppLayout>
  );
}
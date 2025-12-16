// src/pages/DashboardPage.tsx

import AppLayout from "../layouts/AppLayout";
import Content from "../components/Content";
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
      ]}
      sidebarContent={<DashboardSidebar />}
    >
      <Content />
    </AppLayout>
  );
}
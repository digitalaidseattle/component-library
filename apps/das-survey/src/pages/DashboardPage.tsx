// src/pages/DashboardPage.tsx

import AppLayout from "../layouts/AppLayout";
import Content from "../components/Canvas/DashboardCanvas";
import DashboardSidebar from "../components/sidebars/DashboardSidebar";

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
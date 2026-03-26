import { UserContext, UserContextType } from "@digitalaidseattle/core";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { SurveyDashboard, useSurveySession } from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = React.useContext<UserContextType>(UserContext);
  const { drafts, publishedSurveys, deleteSurvey } = useSurveySession();

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
      <SurveyDashboard
        drafts={drafts}
        publishedSurveys={publishedSurveys}
        ownerEmail={user?.email}
        onOpenSurvey={(survey) =>
          navigate(
            survey.status === "draft"
              ? `/surveys/edit/${survey.id}`
              : `/surveys/${survey.id}`
          )
        }
        onDeleteSurvey={async (survey) => {
          if (
            survey.status === "active" &&
            !window.confirm(`Delete the published survey "${survey.title}"?`)
          ) {
            return;
          }

          await deleteSurvey(survey.id, survey.status);
        }}
      />
    </AppLayout>
  );
}

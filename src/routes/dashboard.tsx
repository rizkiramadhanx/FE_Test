import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedLayout from "@/components/layout/protected-layout";
import PageDashboard from "@/features/dashboard/page-dashboard";

import { RouteObject } from "react-router";

const DashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedLayout>
        <DashboardLayout />
      </ProtectedLayout>
    ),
    children: [
      {
        index: true,
        element: <PageDashboard />,
      },
    ],
  },
];

export default DashboardRoutes;

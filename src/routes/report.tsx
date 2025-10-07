import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedLayout from "@/components/layout/protected-layout";
import PageReportDaily from "@/features/report/daily/page-report-daily";

import { RouteObject } from "react-router";

const ReportRoutes: RouteObject[] = [
  {
    path: "/report",
    element: (
      <ProtectedLayout>
        <DashboardLayout />
      </ProtectedLayout>
    ),
    children: [
      {
        index: true,
        element: <h2>Report</h2>,
      },
      {
        path: "daily",
        element: <PageReportDaily />,
      },
    ],
  },
];

export default ReportRoutes;

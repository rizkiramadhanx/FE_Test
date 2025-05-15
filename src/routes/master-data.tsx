import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedLayout from "@/components/layout/protected-layout";
import PageUser from "@/features/master-data/user/page-user";

import { RouteObject } from "react-router";

const MasterDataRoutes: RouteObject[] = [
  {
    path: "/master-data",
    element: (
      <ProtectedLayout>
        <DashboardLayout />
      </ProtectedLayout>
    ),
    children: [
      {
        index: true,
        element: <h2>Master Data</h2>,
      },
      {
        path: "user",
        element: <PageUser />,
      },
    ],
  },
];

export default MasterDataRoutes;

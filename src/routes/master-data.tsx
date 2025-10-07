import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedLayout from "@/components/layout/protected-layout";
import PageGate from "@/features/master-data/gate/page-gate";

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
        path: "gate",
        element: <PageGate />,
      },
    ],
  },
];

export default MasterDataRoutes;

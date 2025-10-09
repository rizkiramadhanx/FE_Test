import NotFound from "@/components/page/page-not-found";
import AuthenticationRoutes from "@/routes/authentication";
import { BrowserRouter, useRoutes } from "react-router";
import DashboardRoutes from "@/routes/dashboard";
import MasterDataRoutes from "@/routes/master-data";
import ReportRoutes from "@/routes/report";

function AllRoutes() {
  const routes = useRoutes([
    ...AuthenticationRoutes,
    ...DashboardRoutes,
    ...MasterDataRoutes,
    ...ReportRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return routes;
}
export default function RoutesGlobal() {
  return (
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  );
}

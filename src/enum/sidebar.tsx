import { ROUTES } from "@/enum/routes";
import { BiUser } from "react-icons/bi";
import { FaDatabase, FaFileAlt, FaTachometerAlt } from "react-icons/fa";

const SidebarMenu = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    path: ROUTES.Dashboard.View,
    activePath: [ROUTES.Dashboard.View],
  },
  {
    title: "Master Gerbang",
    icon: <FaDatabase />,
    path: ROUTES.MasterData.Gate.View,
    activePath: [ROUTES.MasterData.Gate.View],
  },
  {
    title: "Laporan Lalin",
    icon: <FaFileAlt />,
    path: ROUTES.Report.Daily.View,
    activePath: [ROUTES.Report.Daily.View],
    children: [
      {
        title: "Laporan Lalin Harian",
        icon: <FaFileAlt />,
        path: ROUTES.Report.Daily.View,
      },
    ],
  },
];

export default SidebarMenu;

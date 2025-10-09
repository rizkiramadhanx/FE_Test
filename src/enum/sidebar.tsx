import { ROUTES } from "@/enum/routes";
import { BiUser } from "react-icons/bi";
import { FaDatabase, FaFileAlt, FaTachometerAlt } from "react-icons/fa";

const SidebarMenu = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    path: ROUTES.Dashboard.View,
    activePath: [ROUTES.Dashboard.View],
    children: [
      {
        title: "Dashboard Lalin",
        icon: <FaTachometerAlt />,
        path: ROUTES.Dashboard.View,
      },
    ],
  },
  {
    title: "Master Data",
    icon: <FaDatabase />,
    path: ROUTES.MasterData.Gate.View,
    activePath: [ROUTES.MasterData.Gate.View],
    children: [
      {
        title: "Gerbang",
        icon: <BiUser />,
        path: ROUTES.MasterData.Gate.View,
      },
    ],
  },
  {
    title: "Laporan",
    icon: <FaFileAlt />,
    path: ROUTES.Report.Daily.View,
    activePath: [ROUTES.Report.Daily.View],
    children: [
      {
        title: "Laporan Harian",
        icon: <FaFileAlt />,
        path: ROUTES.Report.Daily.View,
      },
    ],
  },
];

export default SidebarMenu;

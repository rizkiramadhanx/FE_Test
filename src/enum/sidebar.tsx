import { ROUTES } from "@/enum/routes";
import { BiUser } from "react-icons/bi";
import { FaCog, FaDatabase, FaFileAlt } from "react-icons/fa";

const SidebarMenu = [
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
  {
    title: "Menu",
    icon: <FaCog />,
    path: ROUTES.Menu.ChildMenu.View,
    activePath: [ROUTES.Menu.ChildMenu.View],
    children: [
      {
        title: "Child Menu",
        icon: <FaCog />,
        path: ROUTES.Menu.ChildMenu.View,
      },
    ],
  },
  {
    title: "Other Menu",
    icon: <FaCog />,
    activePath: ["/master-data/role"],
  },
];

export default SidebarMenu;

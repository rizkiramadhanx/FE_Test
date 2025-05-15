import { ACTION_LIST } from "@/enum/action";
import { ROUTES } from "@/enum/routes";
import { BiUser } from "react-icons/bi";
import { FaCog, FaDatabase } from "react-icons/fa";

const SidebarMenu = [
  {
    title: "Master Data",
    icon: <FaDatabase />,
    path: ROUTES.MasterData.User.View,
    activePath: [ROUTES.MasterData.User.View],
    children: [
      {
        title: "User",
        icon: <BiUser />,
        path: ROUTES.MasterData.User.View,
        action: [ACTION_LIST.MasterData.User.View],
      },
      {
        title: "Child Menu",
        icon: <BiUser />,
        path: ROUTES.Menu.ChildMenu.View,
        action: [ACTION_LIST.MasterData.User.View],
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
        action: [ACTION_LIST.Menu.MenuChild.View],
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

/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import UserPage from "views/User.js";
import UpgradeToPro from "views/Upgrade.js";
import ManageCoursePage from "views/ManageCoursePage.js";
import BatchManager from "views/BatchManager.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-bar-32",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/Icons",
    name: "Manage Student",
    icon: "nc-icon nc-single-02",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Manage Faculties",
    icon: "nc-icon nc-hat-3",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "Profile",
    icon: "nc-icon nc-bookmark-2",
    component: <UserPage />,
    layout: "/admin",
  },
  {
    path: "/ManageCoursePage",
    name: "Manage Course",
    icon: "nc-icon nc-book-bookmark", // Changed icon to represent a book
    component: <ManageCoursePage />,
    layout: "/admin",
  },
  {
    path: "/BatchManager",
    name: "Batch Manage",
    icon: "nc-icon nc-watch-time", // Changed icon to represent a watch/time
    component: <BatchManager />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Manage Schedule",
    icon: "nc-icon nc-calendar-60",
    component: <TableList />,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Manage Exam",
    icon: "nc-icon nc-ruler-pencil", // Changed icon to represent a ruler and pencil
    component: <Typography />,
    layout: "/admin",
  },
  {
    pro: true,
    path: "/upgrade",
    name: "Manage Certification",
    icon: "nc-icon nc-trophy", // Changed icon to represent a trophy
    component: <UpgradeToPro />,
    layout: "/admin",
  },
];

export default routes;

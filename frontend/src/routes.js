import React from 'react';
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import UserPage from "views/User.js";
import ManageCoursePage from "views/ManageCoursePage.js";
import BatchManager from "views/BatchManager.js";
import Courses from "views/Courses";
import Liveclass from "views/Liveclass";
import QandA from "views/QandA";
import UpgradeToPro from "views/Upgrade.js";
import UploadManager from "views/UploadManager.js";
import ScheduleTable from "views/ScheduleTable.js";

// Function to get user's category from session
function getUserCategory() {
  return sessionStorage.getItem("category");
}

const userCategory = getUserCategory();

// Initial routes without conditional components
let routes = [];

// Conditionally include components based on user's category
if (userCategory === 'Student') {
  routes.push(
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "nc-icon nc-chart-bar-32",
      component: <Dashboard />,
      layout: "/admin",
    },
    {
      path: "/user-page",
      name: "Profile",
      icon: "nc-icon nc-bookmark-2",
      component: <UserPage />,
      layout: "/admin",
      category:"admin"
    },
    {
      path: "/Liveclass",
      name: "My Classes",
      icon: "nc-icon nc-tv-2",
      component: <Liveclass />,
      layout: "/admin",
    },
    {
      path: "/Courses",
      name: "My Courses",
      icon: "nc-icon nc-hat-3",
      component: <Courses />,
      layout: "/admin",
    },
    {
      path: "/QandA",
      name: "Question and Answer",
      icon: "nc-icon nc-bulb-63",
      component: <QandA />,
      layout: "/admin",
    }
  );
} else if (userCategory === 'admin') {
  routes.push(
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "nc-icon nc-chart-bar-32",
      component: <Dashboard />,
      layout: "/admin",
    },
    {
      path: "/user-page",
      name: "Profile",
      icon: "nc-icon nc-bookmark-2",
      component: <UserPage />,
      layout: "/admin",
      category:"admin"
    },
    {
      path: "/upgrade",
      name: "Manage Certification",
      icon: "nc-icon nc-trophy",
      component: <UpgradeToPro />,
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
      path: "/ManageCoursePage",
      name: "Manage Course",
      icon: "nc-icon nc-book-bookmark",
      component: <ManageCoursePage />,
      layout: "/admin",
    },
    {
      path: "/BatchManager",
      name: "Batch Manage",
      icon: "nc-icon nc-watch-time",
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
      icon: "nc-icon nc-ruler-pencil",
      component: <Typography />,
      layout: "/admin",
    }
  );
} else if (userCategory === 'Faculty') {
  routes.push(
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "nc-icon nc-chart-bar-32",
      component: <Dashboard />,
      layout: "/admin",
    },
    {
      path: "/user-page",
      name: "Profile",
      icon: "nc-icon nc-bookmark-2",
      component: <UserPage />,
      layout: "/admin",
      category:"admin"
    },
    {
      path: "/UploadManager",
      name: "Manager upload",
      icon: "nc-icon nc-cloud-upload-94",
      component: <UploadManager />,
      layout: "/admin",
    },
    {
      path: "/ScheduleTable",
      name: "My Schedule",
      icon: "nc-icon nc-calendar-60",
      component: <ScheduleTable />,
      layout: "/admin",
    }
  );
} 

export default routes;

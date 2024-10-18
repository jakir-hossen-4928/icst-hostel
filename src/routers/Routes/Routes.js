import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../../layout/main/Main";
import Home from "../../pages/home/Home/Home";
import Signup from "../../shared/signup/Signup";
import Login from "../../shared/login/Login";
import DashboardHome from "../../dashboard/dashboardHome/DashboardHome";
import SearchStudentInfo from "../../dashboard/SearchStudentInfo/SearchStudentInfo";
import Dash from "../../layout/main/AdminDash";
import StudentDash from "../../layout/main/StudentDash";
import Notice from "../../studentDeshboard/notice/Notice";
import Apply from "../../pages/home/apply/Apply";
import AddNotice from "../../dashboard/addNotice/AddNotice";
import StudentdeshHome from "../../studentDeshboard/studentdeshhome/StudentdeshHome";
import EditNotice from "../../dashboard/editnotice/EditNotice";
import ContactList from "../../dashboard/contactList/ContactList";

import Contact from "../../pages/home/contact/Contact";
import PrivateRoute from "../privateroute/PrivateRoute";
import AdminRoute from "../adminroute/AdminRoute";
import ForgotPassword from "../../shared/forgetpasswrod/ForgetPassword";
import SetNewPassword from "../../shared/setnewpasswrod/SetNewPassword";
import AdditionalStudentDataForm from "../../shared/additionalStudentDataForm/AdditionalStudentDataForm";
import AdviceOrComplain from "../../studentDeshboard/adviceorcomplain/AdviceOrComplain";
import AdminFeadbeak from "../../dashboard/feadbeak/AdminFeadbeak";
import Fees from "../../studentDeshboard/fees/Fees";
import RoomsMap from "../../dashboard/rooms/RoomsMap";
import IdCardTemplet from "../../studentDeshboard/idcardtamplet/IdCardTemplet";
import ManagementCosts from "../../dashboard/managmentcosts/ManagementCosts";
import FileUploadComponent from "../../dashboard/managmentcosts/FileUploadComponent";
import StudentProfile from "../../studentDeshboard/studentprofile/StudentProfile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
      {
        path: "/studentDataForm/:id",
        element: <AdditionalStudentDataForm />,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/forgetpassword",
        element: <ForgotPassword></ForgotPassword>,
      },
      {
        path: "/setnewpassword",
        element: <SetNewPassword />,
      },
      {
        path: "/apply",
        element: <Apply></Apply>,
      },
    ],
  },
  {
    path: "/studentdashboard",
    element: (
      <PrivateRoute>
        <StudentDash></StudentDash>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/studentdashboard",
        element: <StudentdeshHome></StudentdeshHome>,
      },
      {
        path: "/studentdashboard/profile",
        element: <StudentProfile></StudentProfile>,
      },
      {
        path: "/studentdashboard/id-card",
        element: <IdCardTemplet />,
      },
      {
        path: "/studentdashboard/advice-complain",
        element: <AdviceOrComplain />,
      },
      {
        path: "/studentdashboard/notice-board",
        element: <Notice></Notice>,
      },
      {
        path: "/studentdashboard/fees",
        element: <Fees />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <AdminRoute>
          <Dash></Dash>
        </AdminRoute>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardHome></DashboardHome>,
      },
      {
        path: "/dashboard/managementcost",
        element: <ManagementCosts ></ManagementCosts>,
      },
      {
        path: "/dashboard/googelsheetsupload",
        element: <FileUploadComponent></FileUploadComponent>,
      },
      {
        path: "/dashboard/searchStudentInfo",
        element: <SearchStudentInfo></SearchStudentInfo>,
      },
      {
        path: "/dashboard/adminfeadbeak",
        element: <AdminFeadbeak />,
      },
      {
        path: "/dashboard/addnotice",
        element: <AddNotice></AddNotice>,
      },
      {
        path: "/dashboard/editnotice",
        element: <EditNotice></EditNotice>,
      },
      {
        path: "/dashboard/displaycontact",
        element: <ContactList></ContactList>,
      },
      {
        path: "/dashboard/roomsmap",
        element: <RoomsMap />,
      },
    ],
  },
]);

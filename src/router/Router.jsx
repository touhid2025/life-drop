import { createBrowserRouter } from "react-router";
import MainLayOut from "../layout/MainLayOut";
import Home from "../pages/Home";
import RegisterLayOut from "../layout/RegisterLayOut";
import Login from "../pages/Login";
import Signup from "../pages/Signup";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayOut></MainLayOut>,
    children: [
        {
            path: "/",
            element: <Home></Home>,
        }
    ]
  },
  {
    path: "/log",
    element: <RegisterLayOut></RegisterLayOut>,
    children: [
        {
            path: "/log/login",
            element: <Login></Login>,
        },
        {
            path: "/log/signup",
            element: <Signup></Signup>,
        }
    ]
  }
]);

export default router;
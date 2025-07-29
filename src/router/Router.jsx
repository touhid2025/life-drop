import { createBrowserRouter } from "react-router";
import MainLayOut from "../layout/MainLayOut";
import Home from "../pages/Home";
import RegisterLayOut from "../layout/RegisterLayOut";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Error from "../pages/Error";
import DashBoard from "../layout/DashBoard";
import Blog from "../pages/Blog";
import DonationReq from "../pages/DonationReq";
import Profile from "../pages/Profile";
import MyDonation from "../pages/MyDonation";
import DashContent from "../component/DashContent";
import CreateDonation from "../pages/CreateDonation";
import AddBlog from "../pages/AddBlog";
import ManageBlogs from "../pages/ManageBlogs";
import ManageUsers from "../pages/ManageUsers";
import ManageDonation from "../pages/ManageDonation";
import BlogDetails from "../pages/BlogDetails";
import DonationDetails from "../pages/DonationDetails";
import SearchDonor from "../pages/SearchDonor";
import PrivateRoute from "../provider/PrivateRout";
import FundUs from "../pages/FundUs";
import AdminDashboardCards from "../pages/AdminDashboardCards";
import Unauthorized from "../pages/Unauthorized";
import AdminRoute from "../provider/AdminRoute";
import Loader from "../component/Loader";
import ViewDetails from "../pages/ViewDetails";



const router = createBrowserRouter([
  {
    path: "/",
    
    element: <MainLayOut></MainLayOut>,
    children: [
        {
            path: "/",
            element: <Home></Home>,
        },
        {
          path: '/blog',
          element: <Blog></Blog>
        },
        {
          path: "/unauthorized",
          element: <Unauthorized></Unauthorized>
        },
        {
          path: "/funding",
          element: <PrivateRoute><FundUs></FundUs></PrivateRoute>
        },
        {
          path: "/blogs/:id",
          element: <PrivateRoute><BlogDetails></BlogDetails></PrivateRoute>,
        },
        {
          path: "/search-donor",
          element: <SearchDonor></SearchDonor>
        },
        
        {
          path: '/donation-requests',
          element: <DonationReq></DonationReq>
        },
        {
          path: "/donation-details/:id",
          element: <PrivateRoute><DonationDetails></DonationDetails></PrivateRoute>
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
            loader: async () => {
            const [districtsRes, upazilasRes] = await Promise.all([
            fetch('/districts.json'),
            fetch('/upazilas.json')
              ]);

            const [districts, upazilas] = await Promise.all([
            districtsRes.json(),
            upazilasRes.json()
            ]);

            return { districts, upazilas };
              },
              hydrateFallbackElement: <Loader></Loader>,
            element: <Signup />,


           }
          ]
  },
  {
    path: "/dashboard",
    element: <DashBoard></DashBoard>,
    children: [
      {
        path: "/dashboard",
        element: <PrivateRoute><DashContent></DashContent></PrivateRoute>
      },
      {
        path: "view-details/:id",
        element: <PrivateRoute><ViewDetails></ViewDetails></PrivateRoute>
      },
      {
        path: "profile",
        loader: async () => {
            const [districtsRes, upazilasRes] = await Promise.all([
            fetch('/districts.json'),
            fetch('/upazilas.json')
              ]);

            const [districts, upazilas] = await Promise.all([
            districtsRes.json(),
            upazilasRes.json()
            ]);

            return { districts, upazilas };
              },
               hydrateFallbackElement: <Loader></Loader>,
        element: <PrivateRoute><Profile></Profile></PrivateRoute>,
      },
      {
        path: "my-donation",
        element: <PrivateRoute><MyDonation></MyDonation></PrivateRoute>,
      },
      {
        path: "manage-donation",
        element: <AdminRoute><ManageDonation></ManageDonation></AdminRoute>
      },
      {
        path: "admin-dashboard",
        element: <AdminRoute><AdminDashboardCards></AdminDashboardCards></AdminRoute>
      },
      {
        path: "add-blogs",
        element: <AdminRoute><AddBlog></AddBlog></AdminRoute>,
      },
      {
        path: "manage-blogs",
        element: <AdminRoute><ManageBlogs></ManageBlogs></AdminRoute>,
      },
      {
        path: "manage-users",
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
      },
      {
        path: "create",
        loader: async () => {
            const [districtsRes, upazilasRes] = await Promise.all([
            fetch('/districts.json'),
            fetch('/upazilas.json')
              ]);

            const [districts, upazilas] = await Promise.all([
            districtsRes.json(),
            upazilasRes.json()
            ]);

            return { districts, upazilas };
              },
               hydrateFallbackElement: <Loader></Loader>,
        element: <CreateDonation></CreateDonation>
      }
    ]

  },
  {
    path: "/*",
    element: <Error></Error>,
  }
]);

export default router;
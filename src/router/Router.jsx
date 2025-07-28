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



const router = createBrowserRouter([
  {
    path: "/",
    
    element: <MainLayOut></MainLayOut>,
    children: [
        {
            path: "/",
            loader: ()=>fetch('http://localhost:5000/api/users'),
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
          element: <FundUs></FundUs>
        },
        {
          path: "/blogs/:id",
          element: <BlogDetails></BlogDetails>,
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
          element: <DonationDetails></DonationDetails>
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
        element: <DashContent></DashContent>
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
        element: <Profile></Profile>,
      },
      {
        path: "my-donation",
        element: <MyDonation></MyDonation>,
      },
      {
        path: "manage-donation",
        element: <ManageDonation></ManageDonation>
      },
      {
        path: "admin-dashboard",
        element: <AdminDashboardCards></AdminDashboardCards>
      },
      {
        path: "add-blogs",
        element: <AddBlog></AddBlog>,
      },
      {
        path: "manage-blogs",
        loader: ()=>fetch('http://localhost:5000/api/users'),
        element: <ManageBlogs></ManageBlogs>,
      },
      {
        path: "manage-users",
        element: <ManageUsers></ManageUsers>
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
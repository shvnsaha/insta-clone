import EditProfile from "@/components/EditProfile";
import Profile from "@/components/Profile";
import MainLayout from "@/layout/MainLayout";
import ChatPage from "@/pages/ChatPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import {
    createBrowserRouter,
  } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoutes><MainLayout></MainLayout></PrivateRoutes>,
        children:[
            {
                path: '/',
                element: <PrivateRoutes><Home/></PrivateRoutes>
            },
            {
                path: '/profile/:id',
                element: <PrivateRoutes><Profile /></PrivateRoutes>
              },
              {
                path: '/account/edit',
                element: <PrivateRoutes><EditProfile /></PrivateRoutes>
              },
              {
                path: '/chat',
                element: <PrivateRoutes><ChatPage /></PrivateRoutes>
              },
        ]
    },
    {
        path:'/login',
        element: <Login></Login>
    },
    {
        path:'signup',
        element: <Signup></Signup>
    }
])

export default router
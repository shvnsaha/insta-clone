import Sidebar from "@/components/Sidebar";
import { setOnlineUsers } from "@/redux/slice/chatSlice";
import { setLikeNotification } from "@/redux/slice/rtnSlice";
import { setSocket } from "@/redux/slice/socketSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

const MainLayout = () => {


    const { user } = useSelector(store => store.auth);
    const { socket } = useSelector(store => store.socketio);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
          const socketio = io('https://insta-clone-rlk0.onrender.com', {
            query: {
              userId: user?._id
            },
            transports: ['websocket']
          });
          dispatch(setSocket(socketio));
    
          // listen all the events
          socketio.on('getOnlineUsers', (onlineUsers) => {
            dispatch(setOnlineUsers(onlineUsers));
          });
    
          socketio.on('notification', (notification) => {
            dispatch(setLikeNotification(notification));
          });
    
          return () => {
            socketio.close();
            dispatch(setSocket(null));
          }
        } else if (socket) {
          socket.close();
          dispatch(setSocket(null));
        }
      }, [user, dispatch]);
    

    return (
        <div className='relative min-h-screen md:flex'>
            {/* Sidebar Component */}
            <Sidebar></Sidebar>
            <div className='flex-1  md:ml-64'>
                <div className='p-5'>{/* Outlet for dynamic contents */}
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
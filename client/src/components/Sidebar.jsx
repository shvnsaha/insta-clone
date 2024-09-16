import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineBars } from 'react-icons/ai'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axiosSecure from "@/api";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/slice/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/slice/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";




const Sidebar = () => {
    const navigate = useNavigate()
    const [isActive, setActive] = useState(false)
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { likeNotification } = useSelector(store => store.realTimeNotification);



    // Sidebar Responsive Handler
    const handleToggle = () => {
        setActive(!isActive)
    }

    // logout
    const logoutHandler = async () => {
        try {
            const res = await axiosSecure('/user/logout');
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }



    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]

    return (
        <>
            {/* Small Screen Navbar */}
            <div className='bg-gray-100 sticky text-gray-800 flex justify-between md:hidden'>
                <div>
                    <div className='block cursor-pointer p-4 font-bold'>
                        <Link to={'/'} className=''>
                            Home
                        </Link>
                    </div>
                </div>

                <button
                    onClick={handleToggle}
                    className='mobile-menu-button p-4 focus:outline-none focus:bg-gray-200'
                >
                    <AiOutlineBars className='h-5 w-5' />
                </button>
            </div>
            {/* Sidebar */}
            <div
                className={`z-10 fixed flex flex-col overflow-x-hidden bg-gray-100 md:bg-transparent border-r border-gray-300 w-64 px-2 py-4 inset-y-0 left-0 transform ${isActive && '-translate-x-full'
                    }  md:translate-x-0  transition duration-200 ease-in-out`}
            >
                {
                    sidebarItems.map((item, index) => {
                        return (
                            <div onClick={() => sidebarHandler(item.text)} key={index} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
                                {item.icon}
                                <span>{item.text}</span>
                                {
                                    item.text === "Notifications" && likeNotification.length > 0 && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div>
                                                    {
                                                        likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                            likeNotification.map((notification) => {
                                                                return (
                                                                    <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                        <Avatar>
                                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                        <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                    </div>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }
                            </div>
                        )
                    })
                }


            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </>
    )
}

export default Sidebar
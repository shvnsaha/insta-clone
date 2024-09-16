import axiosSecure from "@/api";
import { setPosts } from "@/redux/slice/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axiosSecure('/post/all');
                if (res.data.success) { 
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
export default useGetAllPost;
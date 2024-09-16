import axiosSecure from "@/api";
import { setSuggestedUsers } from "@/redux/slice/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axiosSecure('/user/suggested');
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
export default useGetSuggestedUsers;
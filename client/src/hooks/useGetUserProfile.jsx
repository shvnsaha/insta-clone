
import axiosSecure from "@/api";
import { setUserProfile } from "@/redux/slice/authSlice.js";


import { useEffect, } from "react";
import { useDispatch } from "react-redux";


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axiosSecure(`/user/${userId}/profile`);
                if (res.data.success) { 
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
};
export default useGetUserProfile;
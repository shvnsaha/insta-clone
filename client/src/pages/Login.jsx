
import axiosSecure from "@/api";
import { TbFidgetSpinner } from "react-icons/tb";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/slice/authSlice";


const Login = () => {

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        const userData = {
            email,
            password
        }

        console.log(userData);

        try {
            setLoading(true)
            const res = await axiosSecure.post('/user/login', userData)
            if (res && res.data) {
                if (res.data.success) {
                    dispatch(setAuthUser(res?.data?.user));
                    toast.success(res.data.message);
                    navigate('/');
                }}
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="shadow-lg p-8">
                <div className="text-center my-4 space-y-2">
                    <h1 className="font-bold text-xl">Logo</h1>
                    <p className="text-sm">Signup to see photos and videos from your friends</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input
                            type="text"
                            name="email"
                            className="focus-visible:ring-transparent"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            className="focus-visible:ring-transparent"
                        />
                    </div>
                    <div className="flex flex-col">
                        <Button type="submit">
                            {loading ? (
                                <TbFidgetSpinner className="animate-spin m-auto" />
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>
                    <p className="px-6 text-sm text-center text-gray-400">
                        Don&apos;t have an account yet?{" "}
                        <Link
                            to="/signup"
                            className="hover:underline hover:text-rose-500 text-gray-600"
                        >
                            Sign up
                        </Link>
                        .
                    </p>
                </form>

            </div>
        </div>
    );
};

export default Login;
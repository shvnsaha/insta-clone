import Feed from "@/components/Feed";
import RightSideBar from "@/components/RightSideBar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";


const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className="flex">
            <div className="flex-grow ">
                 <Feed></Feed>
            </div>
            <RightSideBar></RightSideBar>
        </div>
    );
};

export default Home;
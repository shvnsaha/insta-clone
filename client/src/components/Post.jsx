import { useSelector } from "react-redux";
import PostCard from "./PostCard";


const Post = () => {
    const {posts} = useSelector(store=>store.post);

    return (
        <div>
           {
            posts.map((post)=><PostCard key={post?._id} post={post}></PostCard>)
           }
        </div>
    );
};

export default Post;
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something Went Wrong",
                success: false
            })
        }

    
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: "Email address already exists",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        })

        
        return res.status(200).json({
            message: "Account Created successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
        if (!email || !password) {
            return res.status(401).json({
                message: "Something Went Wrong",
                success: false
            })
        }

        let user = await User.findOne({ email })
        const isPassworMatch = await bcrypt.compare(password, user.password);
        if (!user || !isPassworMatch) {
            return res.status(401).json({
                message: "Incorrect Email or password",
                success: false
            })
        }

        const token = await jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome Back ${user.username}`,
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully',
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks')
        return res.status(200).json({
            message: "Profile retrieved successfully",
            user ,
            success: true  
        })
    } catch (error) {
      console.log(error);
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};


export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
                success: false
            })
        }
        return res.status(200).json({
            message: 'users retrieved successfully',
            success: true,
            users: suggestedUsers
        })

    } catch (error) {
        console.log(error);
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const userId = req.id; // patel
        const followingId = req.params.id; // shivani
        if (userId === followingId) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(followingId);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
         
    //    check isFollowing or not
        const isFollowing = user.following.includes(followingId);
        if (isFollowing) {
            // unfollow logic 
            await Promise.all([
                User.updateOne({ _id: userId }, { $pull: { following: followingId } }),
                User.updateOne({ _id: followingId }, { $pull: { followers: userId } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic 
            await Promise.all([
                User.updateOne({ _id: userId }, { $push: { following: followingId } }),
                User.updateOne({ _id: followingId }, { $push: { followers: userId } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}
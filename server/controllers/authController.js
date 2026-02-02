import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All Fields Are Required", success: false });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User Already Exist...", success: false });

        const saltRounds = Number(process.env.SALT);
        const hashPassword = await bcrypt.hash(password, saltRounds);
        await User.create({
            name,
            email,
            password: hashPassword
        })
        return res.status(200).json({ message: "Account Created SuccessFully...", success: true })
    } catch (err) {
        console.log(err);

    }
}
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All Fields Are Required...",
                success: false,
            });
        }

        const user = await User.findOne({ email });

        // ✅ FIX IS HERE
        if (!user) {
            return res.status(400).json({
                message: "Incorrect Email And Password...",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect Email And Password...",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
        };

        const token = jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
            })
            .json({
                message: `${user.name} Login Successfully...`,
                success: true,
                user,
            });

    } catch (err) {
        console.log(err);
    }
};

export const Logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged Out SuccessFully"
        })
    } catch (err) {
        console.log(err);
    }
}
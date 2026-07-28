import { User } from "../models/user.models.js";

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password is required." })

        }
        const logedin = await User.findOne({ email })

        if (!logedin)
            return res
                .status(401)
                .json({ message: "Invalid Credentials" })

        const passwordCheck = await logedin.isPasswordCorrect(password)

        if (!passwordCheck) {
            return res
                .status(401)
                .json({ message: "Invalid Credentials" })

        }

        const accessToken = await logedin.generateAccessToken()
        const refreshToken = await logedin.generateRefreshToken()
        return res
            .cookie("refreshToken", refreshToken ,{
                httpOnly: true, 
                secure: true,
                sameSite: "strict"
            })
            .status(200)
            .json({
                message: "Login Successfully", accessToken,
                user: {
                    _id: logedin._id,
                    name: logedin.name,
                    email: logedin.email,
                    role: logedin.role
                }

            })

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error.message })
    }
}
export {
    login
}
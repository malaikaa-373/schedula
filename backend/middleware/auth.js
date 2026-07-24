import jwt from "jsonwebtoken"

// Middleware to check if the request has a valid logged-in user

const auth = (req, res, next) => {
    // Step 1: check karo Authorization header maujood hai ya nahi
    // agar nahi hai, to request yahin rok do (401 = not authenticated)
    if (!req.headers.authorization) {
        return res
            .status(401)
            .json({ message: "Something went wrong" })
    }
    // Step 2: header ka format hota hai  use split 
    const token = req.headers.authorization.split(" ")[1]

    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //forward req to controller
        next()
    } catch (error) {
        //any error im token 
        return res
            .status(401)
            .json({ message: "Invalid Token" })

    }

}

export {
    auth
}

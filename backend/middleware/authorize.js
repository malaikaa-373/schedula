const authorize = (allowedRoles) =>{
    
    return (req,res,next) =>{
        //check the permission for user's role
        if (!allowedRoles.includes(req.user.role)) {
            return res
            .status(403)
            .json({message:"NO permission"})
        }
        next()
    }
}

export{
    authorize
}
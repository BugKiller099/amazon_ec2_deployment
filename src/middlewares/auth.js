const adminAuth = (req, res, next)=>{
    console.log("admin auth is being checked");
    const token="xyz";
    const isAdminAutherized = token=== "xyz";
    if(!isAdminAutherized){
        res.status(401).send("Authorized request");
    }else {
        next();
    }
};
const userAuth = (req, res, next)=>{
    console.log("user auth is being checked");
    const token="xyz";
    const isAdminAutherized = token=== "xyz";
    if(!isAdminAutherized){
        res.status(401).send("Authorized request");
    }else {
        next();
    }
};


module.exports ={
    adminAuth, userAuth
}
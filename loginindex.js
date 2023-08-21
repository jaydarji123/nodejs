//login.ejs and logout.ejs are used here
//Timeline 2.49.29

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"Backend",
}).then( () => console.log("Database Connected")).catch(e=> console.log(e));

const userschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User",userschema);

const app = express();

app.use(express.static(path.join(path.resolve(),"public"))); //path.join is used to concate paths, path.resolve is used to get current directory.
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set("view engine","ejs");

//This is handler and middleware
const isAuthenticate = async (req,res,next) => {
    const { token } = req.cookies;
    if(token){
        const decoded = jwt.verify(token,"qweasdzxc");
        
        req.user = await User.findById(decoded._id);
        next();     //used to call next handler
    }
    else{
        res.redirect("/login");
    }
};


app.get("/", isAuthenticate, (req,res) => { 
    res.render("logout",{name:req.user.name});
}); //we can user multiple handlers with ,. here isAtuthenticate is 1st handler then 2nd hadler is direct

app.get("/register",(req,res)=> {
    res.render("register");
})

app.get("/login",(req,res) => {
    res.render("login");
});

app.post("/register",async  (req,res) => {
    const {name,email,password} = req.body;

    let userdet = await User.findOne({email});
    if(userdet){
        return res.redirect("/login");
    }

    const hashpassword = await bcrypt.hash(password,10);

    userdet = await User.create({name,email,password:hashpassword});
    
    const token = jwt.sign({_id:userdet._id},"qweasdzxc");

    /*res.cookie("token", token, {
        httpOnly:true,
        expires: new Date(Date.now()+60*1000),
    });*/
    return res.render("login", {info: "Registed successfully"});
});

app.post("/login", async (req,res)=> {
    const {email,password} = req.body;
    let userdet = await User.findOne({email});
    if(!userdet){
        return res.redirect("/register");
    }
    const match = await bcrypt.compare(password,userdet.password);

    if(!match){
        return res.render("login" ,{email, message : "Incorrect password"});
    }

    const token = jwt.sign({_id:userdet._id},"qweasdzxc");
    res.cookie("token", token, {
        httpOnly:true,
        expires: new Date(Date.now()+60*1000),
    });

    res.redirect("/");
});

app.get("/logout", (req,res)=> {
    res.cookie("token",null, {
        httpOnly:true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
})

app.listen(5000, () => {
    console.log("Server is Working");
});
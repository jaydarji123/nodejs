//index file for express
//index.ejs used here
//to run with npm run dev change file name in package.json inside script to index.js

import express from 'express';
import path from "path";
import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"Backend",
}).then( () => console.log("Database Connected")).catch(e=> console.log(e));

const messageschema = new mongoose.Schema({
    name: String,
    email: String,
});

const Message = mongoose.model("Message",messageschema);

const app = express();


//app.use is used for middleware
app.use(express.static(path.join(path.resolve(),"public"))); //path.join is used to concate paths, path.resolve is used to get current directory.
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs"); 


app.get("/", (req,res) => {
    res.render("index",{name:"Jayesh"});
})

app.post("/", async (req,res)=> {  // use / by default as in html form tag has no attribute action if in html action has value action="/contact" then we need to use here /contact instead of /
    
    /*const {name,email} = req.body; // Destructuring onject
    await Message.create(name,email); //key and value are same then directly written like this
    res.redirect("/done");*/

    //OOOORRRR
    
    await Message.create({ name: req.body.name, email: req.body.email});
    res.redirect("/done");
});


app.get("/done",(req,res) => {
    res.send(`Data added successfully...`);
});



app.get("/users",(req,res)=> {
    res.json({
        user,
    })
})

app.listen(5000, () => {
    console.log("Server is Working");
})
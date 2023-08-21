//NodeJS 
//index file for nodejs
//to run with npm run dev change file name in package.json inside script to index.js

import http from "http";
import fs from "fs";


/*way-1
import gname from "./conn.js";  //.js in required 100%
import {name2,name3} from "./conn.js";
console.log(gname);
console.log(name2);
console.log(name3);*/

//way-2
import * as obj from "./conn.js";
console.log(obj);
console.log(obj.name2);
console.log(obj.love());


const server = http.createServer((req,res) => {
    if(req.url === "/about"){
        res.end(`<h1>About Page Love is ${obj.love()}</h1>`);
    }
    else if(req.url === "/"){
        fs.readFile("./index.html", (err,home) => {
            res.end(home);
        })
    }
    else if(req.url === "/contact"){
        res.end("<h1>Contact Page</h1>");
    }
    else{
        res.end("<h1>Page Not Found</h1>");
    }

});

server.listen(5000,()=> {
    console.log("Server is On");
})
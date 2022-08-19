
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const md5 = require("md5");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");

mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: 1
    }
});

const User = new mongoose.model("User" , userSchema);

app.get("/", (req,res) => {
    res.render("home");
})

app.get("/login", (req,res) => {
    res.render("login");
})

app.get("/register", (req,res) => {
    res.render("register");
})

// app.get("/secrets", (req,res) => {
//     res.render("secrets");
// })

app.post("/register" , (req , res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err) => {
        if(!err){
            res.render("secrets");
        }else{
            res.send(err);
        }
    });

});

app.post("/login" , (req , res) => {
    const userEmail = req.body.username;
    const userPassword = md5(req.body.password);

    User.findOne({email: userEmail}, (err , foundUser) => {
        if(err){
            res.send(err);
        }else{
            if(foundUser){
                if(foundUser.password === userPassword && foundUser.email === userEmail){
                    res.render("secrets");
                };
            };
        };
    });
});

app.listen(port, () => {
    console.log("Server is running at port " + port);
})
const express=require('express')
const app=express()
const path=require('path')
const UserRoutes=require('./routes/user')
const mongoose=require("mongoose")
const cookieParser=require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middlewares/authenticate')
const { log } = require('console')
const port=8000

app.set("view engine","ejs")
app.set("views",path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

mongoose.connect("mongodb://127.0.0.1:27017/LegalAwarenessHub").then(()=>{
    console.log('connected to db');
}).catch((e)=>{
    console.error("no connect"+e);
})
app.get('/',(req,res)=>{
    
    res.render('home',{
        user:req.user
    })
    })


app.use('/user',UserRoutes)

app.listen(port,()=>console.log(`server lissing at http://localhost:${port}`))
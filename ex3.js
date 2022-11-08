import express from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_please_change_me"

const app = express();

app.use((req,res,next)=> {
    console.log(req.path)
    next()
})

app.use(express.urlencoded()); // <- gets data from HTML form

app.get("/jwt/login",(req,res) => {
    res.send(` 
        <h1>JWT exercise</h1>
        <form action="/jwt/connect" method="post">
            <label for="username">
            username
                <input name="username">
            </label>
            <label for="password">
            password
                <input type="password" name="password">
            </label>
            <input type="submit" />
        </form>
    `)
})

app.post("/jwt/connect",(req,res) => {
    const itsJohnGuys = req.body.username.toLowerCase() === "john" && req.body.password === "doe"
    if(itsJohnGuys) {
        var token = jwt.sign(
            { name: req.body.username, cart:[123,234,432,35,54456], paidUser: true }
            ,JWT_SECRET
             );
        res.cookie("jwt", token)
        res.redirect("/jwt/jwt-checker-form")
    } else {
        res.redirect("/jwt/login")
    }
})

app.get("/jwt/jwt-checker-form",(req,res) => {
    res.send(` 
        <h1>welcome to the JWT jwt-checker-form page</h1>
        <form action="/jwt/checkJWT" method="post">
            <label for="jwt">
            jwt
                <input name="jwt" placeholder="please past your JWT here to check that it is valid">
            </label>
            <input type="submit" />
        </form>
        <a href="/session/logout">logout</a>
    `)
})

app.post("/jwt/checkJWT",(req,res) => {
    console.log(req.body.jwt)
    const isValid = verifyJWT(req.body.jwt, JWT_SECRET)
    if(isValid) {
    res.send("token is valid!")
    }
    res.send("token is not valid!")
})

app.get("/session/logout",(req,res) => {
    req.session.destroy()
    res.redirect("/session/login")
})

app.listen(8080);

function verifyJWT(token, secret) {
    try {
        const result = jwt.verify(token, secret)
        console.log(result)
        return result
    } catch(e) {
        console.log(e.message)
        return false
    }
}
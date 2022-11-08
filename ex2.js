import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
 secret: 'keyboard cat',
 cookie: {}
}));

app.use((req,res,next)=> {
    console.log(req.session)
    next()
})

app.use(express.urlencoded()); // <- gets data from HTML form

app.get("/session/login",(req,res) => {
    res.send(` 
        <form action="/session/connect" method="post">
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
app.post("/session/connect",(req,res) => {

    //mongoose /mongodb stuff 
    // user exists?
    // password matches?

    const itsJohnGuys = req.body.username.toLowerCase() === "john" && req.body.password === "doe"
    if(itsJohnGuys) {
        req.session.username = req.body.username
        req.session.isConnected = true
        req.session.loggedIn = true
        req.session.userID = "1928eu129e127ez1223ziuuh298h212"
        req.session.prefs = {lang:"de"}
        res.redirect("/session/admin")
    } else {
        res.redirect("/session/login")
    }
})

app.get("/session/admin",(req,res) => {
    if(req.session.isConnected) {
        res.send(` 
            <h1>welcome to the admin page</h1>
            <a href="/session/logout">logout</a>
    `)
    } else {
        res.redirect("/session/login")
    }
})
app.get("/session/logout",(req,res) => {
    req.session.destroy()
    res.redirect("/session/login")
    //https://storage.whmcs.community/monthly_2019_02/1928302323_ScreenShot2019-02-16at11_50_18AM.png.df76702a9c391e9346c35c9f509c3e99.png
})

app.listen(8080);
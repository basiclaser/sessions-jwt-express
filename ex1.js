import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
 secret: 'keyboard cat',
 cookie: {}
}));

app.get('/setName', (req, res) => {
    console.log(req.sessionID)
    req.session.name = 'bob';
    res.end();
});

app.get('/getName', (req, res) =>{
    console.log(req.sessionID)
    res.send(req.session.name || 'no name added yet' )
});

app.listen(8080);
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header("origin"));
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
    cors({
        credentials: true,
        origin: true,
    })
);

const users = [
    {
        id: "asdfsadfsd654asefs54",
        name: "mike"
    },
    {
        id: "asdfsadfsd654asefs54",
        name: "kai"
    },
    {
        id: "asdfsadfsd654asefs54",
        name: "danielle"
    },
    {
        id: "asdfsadfsd654asefs54",
        name: "eva"
    }
]

const MySecret = "MySecret"

app.post("/login", (req, res) => {
    const name = req.body.name;
    const user = users.find(x => x.name === name)
    const userID = user.id
    console.log(userID)
    console.log(user.name)

    if (user === null) {
        res.status(204).send();
    } else {
        const token = jwt.sign(
            { value: userID },
            MySecret
        );

        res.cookie("mvx_jwt",
            token,
            { httpOnly: true, sameSite: 'strict', secure: true })
            // { sameSite: 'strict', secure: true, })
            .send();
    }
})


app.post("/test", CheckJWT, (req, res) => {
    console.log("Request was authenticated")

    res.send(req.user)
})


function CheckJWT(req, res, next) {
    console.log("Entering CheckJWT...")
    const token = req.cookies.mvx_jwt;
    console.log("🚀 ~ file: server.js:80 ~ CheckJWT ~ token:", token)

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, MySecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user.value;
        console.log(user);
        console.log("Token is valid!");
        next();
    });
}



app.listen(3000, () => {
    console.log("Server running at http://localhost:3000")
})


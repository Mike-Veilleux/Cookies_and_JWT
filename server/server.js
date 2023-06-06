const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
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
    // origin: ["http://127.0.0.1:3000"],
    origin: true,
  })
);

const users = [
  {
    id: "123456910",
    name: "mike",
    title: "Software Engineer",
  },
  {
    id: "abcdefg",
    name: "kai",
    title: "Student",
  },
  {
    id: "65as4d654asd",
    name: "danielle",
    title: "Teacher",
  },
  {
    id: "btsPower",
    name: "eva",
    title: "Unemployed",
  },
];

const MySecret = "MySecret";

app.post("/login", (req, res) => {
  const name = req.body.name;
  const user = users.find((x) => x.name === name);
  console.log(user);

  if (user === undefined) {
    res.status(204).send();
  } else {
    const userID = user.id;
    console.log(userID);
    const token = jwt.sign({ value: userID }, MySecret);

    res
      .cookie("mvx_jwt", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 9 * 60 * 60 * 1000, // hours x minutes x seconds x milliseconds
      })
      .send(user);
  }
});

app.post("/logout", (req, res) => {
  const token = jwt.sign({ value: "Expired" }, MySecret);
  console.log("Logout Signed Token: ", token);
  res
    .cookie("mvx_jwt", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 0,
    })
    .send({});
});

app.post("/test", CheckJWT, (req, res) => {
  console.log("Request was authenticated");
  const user = users.find((x) => x.id === req.user);
  if (user === undefined) {
    res.status(204).send();
  } else {
    res.send(user);
  }
});

function CheckJWT(req, res, next) {
  console.log("Entering CheckJWT...");
  const token = req.cookies.mvx_jwt;
  console.log("Encoded Token: ", token);
  console.log("Raw Cookie: ", req.cookies);
  if (token == null) {
    res.status(401);
  } else {
    jwt.verify(token, MySecret, (err, result) => {
      if (err) return res.sendStatus(403);
      req.user = result.value;
      console.log("Decoded token:", result);
      console.log("Token is valid!");
    });
  }
  next();
}

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

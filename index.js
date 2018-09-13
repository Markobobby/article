// Require Node.JS Dependencies
const { join } = require("path");


// Require Third-party dependencies
// const polka = require("polka");
const express = require("express");
//const edge = require("edge.js");
//const serv = require("serve-static");
const bodyParser = require("body-parser");
const session = require("express-session");

const userJson = require("./src/users.json");

// Configure Edge.js
// edge.configure({
//     cache: false
// });

// Reviews views
// edge.registerViews(join(__dirname, "./views"));

// Create HTTP Server
// const server = polka();
const app = express();

// Reviews views
app.use(require("express-edge"));
app.set("views", `${__dirname}/views`);

// Serve static assets to /public directory
// app.use(serv(join(__dirname, "public")));
app.use(express.static(join(__dirname, "public")));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret: "keyboard cat"
}));

function authentication(req, res, next) {
    const login = req.body.login;
    console.log("auth()");
    console.log(userJson);
    for (const user of userJson) {
        console.log(user.login);
        if (user.login === login) {
            req.session.user = login;
            console.log(login);
            next();

            return;
        }
    }
    console.log(`Login : ${login} not found`);
    const homeHtml = edge.render("home");
    res.setHeader("content-type", "text/html");
    res.end(homeHtml);
}

// app.use(authentication).get("*", (req, res) => {
// });

app.get("/", (req, res) => {
    const homeHtml = edge.render("home");
    res.setHeader("content-type", "text/html");
    res.end(homeHtml);
});

app.use(authentication).get("/create", (req, res) => {
    console.log("create() ");
    const createHtml = edge.render("create");
    res.redirect(createHtml);
});

app.post("/save", (req,res) =>{
    const article = req.body;
    console.log(article);
});

app.listen(3000);

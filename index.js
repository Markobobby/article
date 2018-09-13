// Require Node.JS Dependencies
const { join } = require("path");


// Require Third-party dependencies
// const polka = require("polka");
const express = require("express");
// const edge = require("edge.js");
// const serv = require("serve-static");
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
    secret: "cleChiffrement"
}));

function authentication(req, res, next) {
    console.log("auth()");
    const login = req.body.login;
    console.log(`body.login : ${login}`);
    for (const user of userJson) {
        console.log(`user.login : ${user.login}`);
        console.log(user.login === login);
        if (user.login === login) {
            console.log("TRUE");
            req.session.user = login;
            next();

            return;
        }
    }
    console.log(`Login : ${login} not found\n`);
    res.render("home", { loginError: "Nom d'utilisateur inconnu" });
}

// app.use(authentication).get("*", (req, res) => {
// });
// Routes
app.get("/", (req, res) => {
    res.render("home");
    // const homeHtml = res.render("home");
    // res.setHeader("content-type", "text/html");
    // res.end(homeHtml);
});

app.post("/create", (req, res) => {
    console.log("create() ");
    res.renderS("/create");
    // const createHtml = res.render("create");
    // res.redirect(createHtml);
});

// app.post("/save", (req, res) => {
//     const article = req.body;
//     console.log(article);
// });

app.listen(3000);
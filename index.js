// Require Node.JS Dependencies
const { join } = require("path");
const { writeFile } = require("fs").promises;

// Require Third-party dependencies
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

// Require Internal Dependencies
const usersSet = new Set(require("./data/users.json"));
const articles = require("./data/articles.json");

// Create Express application
const app = express();

// Reviews views
app.use(require("express-edge"));
app.set("views", join(__dirname, "views"));

// Serve static assets to /public directory
app.use(express.static(join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret: "cleChiffrement",
    resave: false,
    saveUninitialized: true
}));

/*
 * Vérifier si un utilisateur est authentifié. Si "non", redirigé vers / (page d'auth)
 */
function isAuthenticated(req, res, next) {
    if (req.session.login !== undefined) {
        return next();
    }
    res.redirect("/");
}

/**
 * Vérifier si un utilisateur est non-authentifié.
 */
function isNotAuthenticated(req, res, next) {
    if (req.session.login === undefined) {
        return next();
    }
    res.redirect("/articles");
}


// Root
app.get("/", isNotAuthenticated, (req, res) => {
    res.render("home", { login: req.session.login });
});

// Login
app.post("/login", (req, res) => {
    const login = req.body.login;
    if (typeof login !== "string") {
        return res.json({ error: "Merci de fournir une chaîne de caractères valide!" });
    }
    console.log(`login: ${login}`);

    if (req.session.login !== undefined) {
        return res.json({ error: "Déjà authentifié !" });
    }
    if (!usersSet.has(login)) {
        return res.json({ error: `L'identifiant ${login} ne correspond à aucun compte existant!` });
    }
    req.session.login = login;

    res.json({ error: null });
});

// Logout
app.post("/logout", isAuthenticated, (req, res) => {
    req.session.destroy();
    res.json({ error: null });
});

// Page de création d'un article
app.get("/create", isAuthenticated, (req, res) => {
    console.log("create route matched!");
    res.render("create", req.session.article);
});

// Sauvegarder un nouvelle article!
app.post("/save", (req, res) => {
    const article = req.body.article;

    articles.push(article);
    writeFile("./data/articles.json", JSON.stringify(articles, null, 4)).then(() => {
        console.log("Articles sauvegarder avec succès!");
    }).catch(console.error);

    // remettre à zero article session
    req.session.article = undefined;

    res.json({ error: null });
});

// Liste des articles
app.get("/articles", isAuthenticated, (req, res) => {
    console.log("articles route matched!");
    res.render("articles", articles);
});

app.listen(3000);
console.log("HTTP Server listening on port 3000");

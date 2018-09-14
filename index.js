// Require Node.JS Dependencies
const { join } = require("path");
const { writeFile, readFile } = require("fs").promises;

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
    res.render("home", { login: "marko, admin, renaud" });
});

// Login
app.post("/login", (req, res) => {
    const login = req.body.login;
    if (typeof login !== "string") {
        return res.json({ error: "Merci de fournir une chaîne de caractères valide!" });
    }

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
    console.log(req.session.article);
    res.render("create", req.session.article);
});

// Sauvegarder un nouvelle article!
app.post("/save", (req, res) => {
    const article = req.body.article;
    const error = [];
    const err = {};
    console.log(article);
    if (article.isAutoSave) {
        console.log("isAutoSave");
        req.session.article = article;
        console.log("session.article : ");
        console.log(req.session.article);
        res.json(req.session.article);
    } 
    else {
        if (article.name === "" ) {
            error.push("vous devez renseigner un nom");
        } else if (article.prix === "") {
            error.push("Vous devez renseigner un");
            err.error = error;
        } else {
            articles.push(article);
            console.log("write");
            writeFile("./data/articles.json", JSON.stringify(articles, null, 4)).then(() => {
                console.log("Articles sauvegarder avec succès!");
            }).catch(console.error);
            
            err.error = null;
        }
        // remettre à zero article session
        req.session.article = undefined;
        res.json(err);
    }
});

// Liste des articles
app.get("/list", isAuthenticated, async(req, res) => {
    const list = {};
    const data = await readFile("./data/articles.json", "utf-8");
    list.articles = JSON.parse(data);
    res.render("articles", list);
});

app.listen(3000);
console.log("HTTP Server listening on port 3000");

const express = require("express");
const path = require("path");

const reviewRoutes = require("./routes/review");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(reviewRoutes);



app.use((req, res) => {
    res.status(404).render("404");
});

app.use((error, req, res, next) => {
    // Default error handling function
    // Will become active whenever any route / middleware crashes
    console.log(error);
    res.status(500).render("500");
});

//setting up port
app.listen(3000);

//link to open
console.log("http://localhost:3000/");

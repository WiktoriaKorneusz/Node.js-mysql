const express = require("express");
const fetch = require("node-fetch");
const db = require("../data/database");
const router = express.Router();
const url = "https://openlibrary.org/search.json?q=";

// const [reviews] = await db.query('SELECT * FROM reviews INNER JOIN authors ON authors.id = reviews.author_id')
// console.log(reviews)

router.get("/", async (req, res) => {
    const [reviews] = await db.query(
        "SELECT reviews.*, authors.name FROM reviews INNER JOIN authors ON authors.id = reviews.author_id"
    );
    res.render("index", { reviews: reviews });
});

router.get("/reviews/:id", async (req, res) => {
    const query = `SELECT * FROM reviews  INNER JOIN authors ON authors.id = reviews.author_id WHERE reviews.id = ?`;
    const [reviews] = await db.query(query, [req.params.id]);

    if (!reviews || reviews.length === 0) {
        return res.status(404).render("404");
    }

    res.render("individual-review", { review: reviews[0] });
});

router.get("/new-review", async (req, res) => {
    const [authors] = await db.query("SELECT * FROM authors");
    authors.sort((a, b) => (a.name > b.name ? 1 : -1));

    res.render("add", { authors: authors });
});

router.get("/add-author", (req, res) => {
    res.render("add-author");
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.post("/author", async (req, res) => {
    const author = req.body.author.trim();
    await db.query("INSERT INTO authors (name) VALUES (?)", [author]);
    res.redirect("/new-review");
});

router.post("/add", async (req, res) => {
    const data = [
        req.body.title.trim(),
        +req.body.author,
        req.body.summary,
        req.body.body,
        req.body.name,
        +req.body.score,
    ];
    const response = await fetch(url + data[0]);
    const bookData = await response.json();
    const books = bookData.docs;

    const book = books.find(
        (b) => b.title.toLowerCase() == data[0].toLowerCase()
    );

    const image = book
        ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
        : "/img/imageNotFound.png";
    data.push(image);
    await db.query(
        "INSERT INTO reviews (title, author_id, summary, body, reviewer, score, img) VALUES (?)",
        [data]
    );
    res.redirect("/");
});
router.get("/reviews/:id/edit", async (req, res) => {
    const [authors] = await db.query("SELECT * FROM authors");
    authors.sort((a, b) => (a.name > b.name ? 1 : -1));
    const query = "SELECT * FROM reviews WHERE id = ?";
    const [reviews] = await db.query(query, [req.params.id]);
    if (!reviews || reviews.length === 0) {
        return res.status(404).render("404");
    }
    res.render("edit-review", { authors: authors, review: reviews[0] });
});
router.post("/update/:id", async (req, res) => {
    const data = [req.body.summary, req.body.body];
    const query = "UPDATE reviews SET summary = ?, body = ? WHERE id = ?";
    await db.query(query, [req.body.summary, req.body.body, req.params.id]);
    res.redirect(`/reviews/${req.params.id}`)
});
router.post("/reviews/:id/delete", async (req, res) => {
    const query = "DELETE FROM reviews WHERE id = ?"
    await db.query(query, [req.params.id])
    res.redirect("/")
})

module.exports = router;

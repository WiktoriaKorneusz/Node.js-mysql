const fetch = require("node-fetch");
const url = "https://openlibrary.org/search.json?q=";
// const imageUrl = "https://covers.openlibrary.org/b/olid/OL2550667M-M.jpg";

const findBook = async (title) => {
    const response = await fetch(url + title);
    const data = await response.json();
    const books = data.docs;

    let bookData;

    const book = books.find((b) => b.title.toLowerCase() == title.toLowerCase());

    if (book) {
        bookData = {
            title: book.title,
            image: `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`,
        };
    } else {
        bookData = { title: title, image: "/img/imageNotFound.png" };
    }
    console.log(bookData);
};

findBook("hkjdfbkjabzvdbamznvit")
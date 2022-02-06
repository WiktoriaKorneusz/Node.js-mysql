document.addEventListener("DOMContentLoaded", function () {
    M.Sidenav.init(document.querySelector(".sidenav"), {edge: "right", draggable: true});
    M.Parallax.init(document.querySelector(".parallax"));
    M.FormSelect.init(document.querySelector('select'));
    M.textareaAutoResize(document.querySelectorAll('textarea'))
});

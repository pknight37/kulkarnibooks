document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var container = document.getElementById("book-list");
  if (container && typeof BooksRenderer !== "undefined" && typeof KULKARNI_BOOKS !== "undefined") {
    container.innerHTML = BooksRenderer.renderBookList(KULKARNI_BOOKS);
  }
});

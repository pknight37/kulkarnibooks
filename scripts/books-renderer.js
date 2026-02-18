var BooksRenderer = (function () {
  "use strict";

  var PLACEHOLDER_IMAGE = "images/placeholder-cover.svg";

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBookCard(book) {
    var title = escapeHtml(book.title);
    var image = book.coverImage || PLACEHOLDER_IMAGE;
    var description = escapeHtml(book.description);
    var buyLink = escapeHtml(book.buyLink);

    return (
      '<article class="book-card">' +
        '<img class="book-card__cover" src="' + escapeHtml(image) + '" alt="Cover of ' + title + '">' +
        '<div class="book-card__info">' +
          '<h2 class="book-card__title">' + title + '</h2>' +
          '<p class="book-card__description">' + description + '</p>' +
          '<a class="book-card__buy-link" href="' + buyLink + '">Buy this book</a>' +
        '</div>' +
      '</article>'
    );
  }

  function renderBookList(books) {
    if (!books || books.length === 0) {
      return '<div class="books-empty">' +
        '<p>No published works available at this time.</p>' +
        '<a class="books-empty__action" href="contact.html">Contact Dr. Kulkarni</a>' +
      '</div>';
    }
    var html = '<div class="book-grid">';
    for (var i = 0; i < books.length; i++) {
      html += renderBookCard(books[i]);
    }
    html += '</div>';
    return html;
  }

  return {
    renderBookCard: renderBookCard,
    renderBookList: renderBookList,
    escapeHtml: escapeHtml
  };
})();

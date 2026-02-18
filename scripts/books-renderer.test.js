(function () {
  "use strict";

  var results = document.getElementById("results");
  var passCount = 0;
  var failCount = 0;

  function assert(condition, description) {
    var el = document.createElement("p");
    if (condition) {
      el.className = "pass";
      el.textContent = "PASS: " + description;
      passCount++;
    } else {
      el.className = "fail";
      el.textContent = "FAIL: " + description;
      failCount++;
    }
    results.appendChild(el);
  }

  function assertContains(haystack, needle, description) {
    assert(haystack.indexOf(needle) !== -1, description);
  }

  // Test 1: Empty list shows fallback message
  (function () {
    var html = BooksRenderer.renderBookList([]);
    assertContains(html, "No published works", "empty list shows fallback message");
  })();

  // Test 2: Single book renders its title
  (function () {
    var book = { title: "Test Book", coverImage: "img.png", description: "A test.", buyLink: "http://example.com" };
    var html = BooksRenderer.renderBookList([book]);
    assertContains(html, "Test Book", "single book title appears in output");
  })();

  // Test 3: Book card contains cover image with alt text
  (function () {
    var book = { title: "My Book", coverImage: "covers/my-book.jpg", description: "Desc.", buyLink: "http://example.com" };
    var html = BooksRenderer.renderBookCard(book);
    assertContains(html, 'src="covers/my-book.jpg"', "book card contains cover image src");
    assertContains(html, 'alt="Cover of My Book"', "book card contains alt text with title");
  })();

  // Test 4: Book card contains buy link with correct href
  (function () {
    var book = { title: "Buy Me", coverImage: "img.png", description: "Desc.", buyLink: "https://store.example.com/book" };
    var html = BooksRenderer.renderBookCard(book);
    assertContains(html, 'href="https://store.example.com/book"', "book card contains correct buy link href");
    assertContains(html, "Buy this book", "book card contains buy link text");
  })();

  // Test 5: Multiple books produce correct number of cards
  (function () {
    var books = [
      { title: "Book 1", coverImage: "a.png", description: "D1", buyLink: "http://example.com/1" },
      { title: "Book 2", coverImage: "b.png", description: "D2", buyLink: "http://example.com/2" },
      { title: "Book 3", coverImage: "c.png", description: "D3", buyLink: "http://example.com/3" }
    ];
    var html = BooksRenderer.renderBookList(books);
    var count = html.split("book-card").length - 1;
    // Each card has multiple occurrences of "book-card" in class names, so count <article> tags instead
    var articleCount = html.split("<article").length - 1;
    assert(articleCount === 3, "three books produce three article elements (got " + articleCount + ")");
  })();

  // Test 6: Missing coverImage falls back to placeholder
  (function () {
    var book = { title: "No Cover", description: "Desc.", buyLink: "http://example.com" };
    var html = BooksRenderer.renderBookCard(book);
    assertContains(html, "images/placeholder-cover.svg", "missing coverImage uses placeholder");
  })();

  // Test 7: HTML special characters are escaped (XSS prevention)
  (function () {
    assert(BooksRenderer.escapeHtml('<script>') === "&lt;script&gt;", "escapeHtml escapes angle brackets");
    assert(BooksRenderer.escapeHtml('"hello"') === "&quot;hello&quot;", "escapeHtml escapes double quotes");
    assert(BooksRenderer.escapeHtml("A & B") === "A &amp; B", "escapeHtml escapes ampersands");

    var book = { title: '<b>Evil</b>', coverImage: "img.png", description: "Safe", buyLink: "http://example.com" };
    var html = BooksRenderer.renderBookCard(book);
    assert(html.indexOf("<b>Evil</b>") === -1, "HTML in book title is escaped in output");
    assertContains(html, "&lt;b&gt;Evil&lt;/b&gt;", "escaped title appears correctly");
  })();

  var summary = document.createElement("h2");
  summary.textContent = passCount + " passed, " + failCount + " failed";
  summary.className = failCount === 0 ? "pass" : "fail";
  results.prepend(summary);
})();

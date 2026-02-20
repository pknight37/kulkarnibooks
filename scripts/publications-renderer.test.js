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
    var html = PublicationsRenderer.renderPublicationList([]);
    assertContains(html, "No publications available", "empty list shows fallback message");
  })();

  // Test 2: Single publication renders title and year
  (function () {
    var pub = { title: "Trade in India", year: 2020 };
    var html = PublicationsRenderer.renderPublicationList([pub]);
    assertContains(html, "Trade in India", "single publication title appears in output");
    assertContains(html, "2020", "single publication year appears in output");
  })();

  // Test 3: Publication with link renders anchor tag
  (function () {
    var pub = { title: "Linked Article", year: 2021, link: "https://example.com/article" };
    var html = PublicationsRenderer.renderPublicationItem(pub);
    assertContains(html, 'href="https://example.com/article"', "publication with link renders anchor href");
    assertContains(html, "View", "publication with link shows View button");
  })();

  // Test 4: Publication without link renders title as plain text
  (function () {
    var pub = { title: "No Link Article", year: 2019 };
    var html = PublicationsRenderer.renderPublicationItem(pub);
    assert(html.indexOf("<a") === -1 || html.indexOf("pub-item__link") === -1,
      "publication without link does not render linked title");
    assertContains(html, "pub-item__title-text", "publication without link renders plain text title");
  })();

  // Test 5: Search filtering works
  (function () {
    var pubs = [
      { title: "Economics of Trade", year: 2020 },
      { title: "Monetary Policy", year: 2021 },
      { title: "Trade Deficit", year: 2019 }
    ];
    var filtered = PublicationsRenderer.filterPublications(pubs, "trade", "");
    assert(filtered.length === 2, "search for 'trade' returns 2 results (got " + filtered.length + ")");
  })();

  // Test 6: Year filter works
  (function () {
    var pubs = [
      { title: "Article A", year: 2020 },
      { title: "Article B", year: 2021 },
      { title: "Article C", year: 2020 }
    ];
    var filtered = PublicationsRenderer.filterPublications(pubs, "", "2020");
    assert(filtered.length === 2, "year filter for 2020 returns 2 results (got " + filtered.length + ")");
  })();

  // Test 7: HTML special characters are escaped
  (function () {
    assert(PublicationsRenderer.escapeHtml('<script>') === "&lt;script&gt;", "escapeHtml escapes angle brackets");
    assert(PublicationsRenderer.escapeHtml('"hello"') === "&quot;hello&quot;", "escapeHtml escapes double quotes");
    assert(PublicationsRenderer.escapeHtml("A & B") === "A &amp; B", "escapeHtml escapes ampersands");

    var pub = { title: '<b>Evil</b>', year: 2020 };
    var html = PublicationsRenderer.renderPublicationItem(pub);
    assert(html.indexOf("<b>Evil</b>") === -1, "HTML in publication title is escaped in output");
    assertContains(html, "&lt;b&gt;Evil&lt;/b&gt;", "escaped title appears correctly");
  })();

  // Test 8: getDistinctYears returns sorted unique years
  (function () {
    var pubs = [
      { title: "A", year: 2019 },
      { title: "B", year: 2021 },
      { title: "C", year: 2019 },
      { title: "D", year: 2020 }
    ];
    var years = PublicationsRenderer.getDistinctYears(pubs);
    assert(years.length === 3, "getDistinctYears returns 3 unique years (got " + years.length + ")");
    assert(years[0] === 2021 && years[1] === 2020 && years[2] === 2019,
      "years are sorted descending: " + years.join(", "));
  })();

  // Test 9: Combined search and year filter
  (function () {
    var pubs = [
      { title: "Economics of Trade", year: 2020 },
      { title: "Trade Policy", year: 2021 },
      { title: "Trade Deficit", year: 2020 }
    ];
    var filtered = PublicationsRenderer.filterPublications(pubs, "trade", "2020");
    assert(filtered.length === 2, "combined search+year filter returns 2 results (got " + filtered.length + ")");
  })();

  // Test 10: Journal and coAuthors appear in output
  (function () {
    var pub = { title: "Test", year: 2020, journal: "Econ Review", coAuthors: "Smith, J." };
    var html = PublicationsRenderer.renderPublicationItem(pub);
    assertContains(html, "Econ Review", "journal name appears in output");
    assertContains(html, "Smith, J.", "co-authors appear in output");
  })();

  var summary = document.createElement("h2");
  summary.textContent = passCount + " passed, " + failCount + " failed";
  summary.className = failCount === 0 ? "pass" : "fail";
  results.prepend(summary);
})();

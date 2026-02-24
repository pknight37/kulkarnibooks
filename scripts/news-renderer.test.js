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
    var html = NewsRenderer.renderNewsList([]);
    assertContains(html, "No news items available", "empty list shows fallback message");
  })();

  // Test 2: Single news item renders title and date
  (function () {
    var item = { title: "Professor Honored", source: "Denver Post", date: "2025-11-15" };
    var html = NewsRenderer.renderNewsList([item]);
    assertContains(html, "Professor Honored", "single news item title appears in output");
    assertContains(html, "Nov 2025", "single news item date appears as formatted month+year");
  })();

  // Test 3: News item with link renders anchor tag
  (function () {
    var item = { title: "Interview", source: "NPR", date: "2024-06-01", link: "https://example.com/interview" };
    var html = NewsRenderer.renderNewsItem(item);
    assertContains(html, 'href="https://example.com/interview"', "news item with link renders anchor href");
    assertContains(html, "Read", "news item with link shows Read button");
  })();

  // Test 4: News item without link renders title as plain text
  (function () {
    var item = { title: "Press Mention", source: "Local News", date: "2023-03-10" };
    var html = NewsRenderer.renderNewsItem(item);
    assert(html.indexOf("news-item__link") === -1,
      "news item without link does not render linked title");
    assertContains(html, "news-item__title-text", "news item without link renders plain text title");
  })();

  // Test 5: Search filtering works across title and source
  (function () {
    var items = [
      { title: "Economics Award", source: "Denver Post", date: "2025-01-10" },
      { title: "Book Review", source: "Academic Weekly", date: "2024-05-20" },
      { title: "Trade Analysis", source: "Denver Post", date: "2023-09-15" }
    ];
    var filtered = NewsRenderer.filterNews(items, "denver", "");
    assert(filtered.length === 2, "search for 'denver' returns 2 results (got " + filtered.length + ")");
  })();

  // Test 6: Year filter works with ISO dates
  (function () {
    var items = [
      { title: "Article A", source: "Source A", date: "2025-01-10" },
      { title: "Article B", source: "Source B", date: "2024-06-15" },
      { title: "Article C", source: "Source C", date: "2025-11-20" }
    ];
    var filtered = NewsRenderer.filterNews(items, "", "2025");
    assert(filtered.length === 2, "year filter for 2025 returns 2 results (got " + filtered.length + ")");
  })();

  // Test 7: HTML special characters are escaped
  (function () {
    assert(NewsRenderer.escapeHtml('<script>') === "&lt;script&gt;", "escapeHtml escapes angle brackets");
    assert(NewsRenderer.escapeHtml('"hello"') === "&quot;hello&quot;", "escapeHtml escapes double quotes");
    assert(NewsRenderer.escapeHtml("A & B") === "A &amp; B", "escapeHtml escapes ampersands");

    var item = { title: '<b>Evil</b>', source: "Test", date: "2025-01-01" };
    var html = NewsRenderer.renderNewsItem(item);
    assert(html.indexOf("<b>Evil</b>") === -1, "HTML in news title is escaped in output");
    assertContains(html, "&lt;b&gt;Evil&lt;/b&gt;", "escaped title appears correctly");
  })();

  // Test 8: getDistinctYears returns sorted unique years from ISO dates
  (function () {
    var items = [
      { title: "A", source: "S", date: "2023-01-01" },
      { title: "B", source: "S", date: "2025-06-15" },
      { title: "C", source: "S", date: "2023-11-20" },
      { title: "D", source: "S", date: "2024-03-10" }
    ];
    var years = NewsRenderer.getDistinctYears(items);
    assert(years.length === 3, "getDistinctYears returns 3 unique years (got " + years.length + ")");
    assert(years[0] === 2025 && years[1] === 2024 && years[2] === 2023,
      "years are sorted descending: " + years.join(", "));
  })();

  // Test 9: Combined search and year filter
  (function () {
    var items = [
      { title: "Economics Award", source: "Denver Post", date: "2025-01-10" },
      { title: "Trade Policy", source: "NPR", date: "2024-05-20" },
      { title: "Trade Summit", source: "Denver Post", date: "2025-09-15" }
    ];
    var filtered = NewsRenderer.filterNews(items, "denver", "2025");
    assert(filtered.length === 2, "combined search+year filter returns 2 results (got " + filtered.length + ")");
  })();

  // Test 10: Source appears in output
  (function () {
    var item = { title: "Test Article", source: "The Denver Post", date: "2025-01-01" };
    var html = NewsRenderer.renderNewsItem(item);
    assertContains(html, "The Denver Post", "source name appears in output");
    assertContains(html, "news-item__source", "source has correct CSS class");
  })();

  // Test 11: formatDate converts ISO date to "Mon YYYY"
  (function () {
    assert(NewsRenderer.formatDate("2025-11-15") === "Nov 2025", "formatDate converts 2025-11-15 to Nov 2025");
    assert(NewsRenderer.formatDate("2024-01-01") === "Jan 2024", "formatDate converts 2024-01-01 to Jan 2024");
    assert(NewsRenderer.formatDate("2023-12-31") === "Dec 2023", "formatDate converts 2023-12-31 to Dec 2023");
  })();

  // Test 12: getYearFromDate extracts year from ISO date
  (function () {
    assert(NewsRenderer.getYearFromDate("2025-11-15") === 2025, "getYearFromDate extracts 2025 from 2025-11-15");
    assert(NewsRenderer.getYearFromDate("2023-01-01") === 2023, "getYearFromDate extracts 2023 from 2023-01-01");
    assert(NewsRenderer.getYearFromDate("") === null, "getYearFromDate returns null for empty string");
  })();

  var summary = document.createElement("h2");
  summary.textContent = passCount + " passed, " + failCount + " failed";
  summary.className = failCount === 0 ? "pass" : "fail";
  results.prepend(summary);
})();

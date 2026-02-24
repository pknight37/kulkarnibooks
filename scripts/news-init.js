document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var container = document.getElementById("news-list");
  if (!container || typeof NewsRenderer === "undefined" || typeof KULKARNI_NEWS === "undefined") {
    return;
  }

  function render() {
    var searchInput = document.getElementById("news-search");
    var yearSelect = document.getElementById("news-year-filter");
    var searchTerm = searchInput ? searchInput.value : "";
    var yearFilter = yearSelect ? yearSelect.value : "";
    var cursorPos = searchInput ? searchInput.selectionStart : 0;
    container.innerHTML = NewsRenderer.renderNewsList(KULKARNI_NEWS, searchTerm, yearFilter);
    attachListeners();
    var newInput = document.getElementById("news-search");
    if (newInput && searchTerm) {
      newInput.focus();
      newInput.setSelectionRange(cursorPos, cursorPos);
    }
  }

  function attachListeners() {
    var searchInput = document.getElementById("news-search");
    var yearSelect = document.getElementById("news-year-filter");
    if (searchInput) {
      searchInput.addEventListener("input", render);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", render);
    }
  }

  container.innerHTML = NewsRenderer.renderNewsList(KULKARNI_NEWS, "", "");
  attachListeners();
});

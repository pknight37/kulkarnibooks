document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var container = document.getElementById("publications-list");
  if (!container || typeof PublicationsRenderer === "undefined" || typeof KULKARNI_PUBLICATIONS === "undefined") {
    return;
  }

  function render() {
    var searchInput = document.getElementById("pub-search");
    var yearSelect = document.getElementById("pub-year-filter");
    var searchTerm = searchInput ? searchInput.value : "";
    var yearFilter = yearSelect ? yearSelect.value : "";
    var cursorPos = searchInput ? searchInput.selectionStart : 0;
    container.innerHTML = PublicationsRenderer.renderPublicationList(KULKARNI_PUBLICATIONS, searchTerm, yearFilter);
    attachListeners();
    var newInput = document.getElementById("pub-search");
    if (newInput && searchTerm) {
      newInput.focus();
      newInput.setSelectionRange(cursorPos, cursorPos);
    }
  }

  function attachListeners() {
    var searchInput = document.getElementById("pub-search");
    var yearSelect = document.getElementById("pub-year-filter");
    if (searchInput) {
      searchInput.addEventListener("input", render);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", render);
    }
  }

  container.innerHTML = PublicationsRenderer.renderPublicationList(KULKARNI_PUBLICATIONS, "", "");
  attachListeners();
});

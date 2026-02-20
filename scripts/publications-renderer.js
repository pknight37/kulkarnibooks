var PublicationsRenderer = (function () {
  "use strict";

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderPublicationItem(pub) {
    var title = escapeHtml(pub.title);
    var year = escapeHtml(String(pub.year || ""));
    var journal = escapeHtml(pub.journal);
    var coAuthors = escapeHtml(pub.coAuthors);
    var link = escapeHtml(pub.link);

    var titleHtml = link
      ? '<a class="pub-item__link" href="' + link + '" target="_blank" rel="noopener">' + title + '</a>'
      : '<span class="pub-item__title-text">' + title + '</span>';

    var html =
      '<li class="pub-item">' +
        '<div class="pub-item__main">' +
          '<span class="pub-item__title">' + titleHtml + '</span>';

    if (journal) {
      html += ' <span class="pub-item__journal">' + journal + '</span>';
    }

    if (coAuthors) {
      html += ' <span class="pub-item__coauthors">with ' + coAuthors + '</span>';
    }

    html +=
        '</div>' +
        (year ? '<span class="pub-item__year">' + year + '</span>' : '') +
        (link ? '<a class="pub-item__view" href="' + link + '" target="_blank" rel="noopener">View</a>' : '') +
      '</li>';

    return html;
  }

  function getDistinctYears(pubs) {
    var seen = {};
    var years = [];
    for (var i = 0; i < pubs.length; i++) {
      var y = pubs[i].year;
      if (y && !seen[y]) {
        seen[y] = true;
        years.push(y);
      }
    }
    years.sort(function (a, b) { return b - a; });
    return years;
  }

  function filterPublications(pubs, searchTerm, yearFilter) {
    var filtered = [];
    var term = (searchTerm || "").toLowerCase();
    for (var i = 0; i < pubs.length; i++) {
      var pub = pubs[i];

      if (yearFilter && String(pub.year) !== String(yearFilter)) {
        continue;
      }

      if (term) {
        var haystack = (
          (pub.title || "") + " " +
          (pub.journal || "") + " " +
          (pub.coAuthors || "")
        ).toLowerCase();
        if (haystack.indexOf(term) === -1) {
          continue;
        }
      }

      filtered.push(pub);
    }
    return filtered;
  }

  function renderPublicationList(pubs, searchTerm, yearFilter) {
    if (!pubs || pubs.length === 0) {
      return '<div class="pubs-empty">' +
        '<p>No publications available at this time.</p>' +
      '</div>';
    }

    var years = getDistinctYears(pubs);
    var filtered = filterPublications(pubs, searchTerm, yearFilter);

    var html =
      '<div class="pubs-controls">' +
        '<input type="search" id="pub-search" class="pubs-search" placeholder="Search publications\u2026" aria-label="Search publications"' +
          (searchTerm ? ' value="' + escapeHtml(searchTerm) + '"' : '') + '>' +
        '<select id="pub-year-filter" class="pubs-year-filter" aria-label="Filter by year">' +
          '<option value="">All years</option>';

    for (var i = 0; i < years.length; i++) {
      var selected = String(yearFilter) === String(years[i]) ? ' selected' : '';
      html += '<option value="' + years[i] + '"' + selected + '>' + years[i] + '</option>';
    }

    html +=
        '</select>' +
      '</div>';

    if (filtered.length === 0) {
      html += '<p class="pubs-no-results">No publications match your search.</p>';
      return html;
    }

    html += '<p class="pubs-count">' + filtered.length + ' publication' + (filtered.length === 1 ? '' : 's') + '</p>';
    html += '<ul class="pub-list">';
    for (var j = 0; j < filtered.length; j++) {
      html += renderPublicationItem(filtered[j]);
    }
    html += '</ul>';
    return html;
  }

  return {
    renderPublicationItem: renderPublicationItem,
    renderPublicationList: renderPublicationList,
    filterPublications: filterPublications,
    getDistinctYears: getDistinctYears,
    escapeHtml: escapeHtml
  };
})();

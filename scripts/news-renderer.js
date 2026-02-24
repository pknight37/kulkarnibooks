var NewsRenderer = (function () {
  "use strict";

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  function formatDate(isoDate) {
    if (!isoDate) return "";
    var parts = isoDate.split("-");
    var monthIndex = parseInt(parts[1], 10) - 1;
    return MONTH_NAMES[monthIndex] + " " + parts[0];
  }

  function getYearFromDate(isoDate) {
    if (!isoDate) return null;
    return parseInt(isoDate.split("-")[0], 10);
  }

  function renderNewsItem(item) {
    var title = escapeHtml(item.title);
    var source = escapeHtml(item.source);
    var date = formatDate(item.date);
    var link = escapeHtml(item.link);

    var titleHtml = link
      ? '<a class="news-item__link" href="' + link + '" target="_blank" rel="noopener">' + title + '</a>'
      : '<span class="news-item__title-text">' + title + '</span>';

    var html =
      '<li class="news-item">' +
        '<div class="news-item__main">' +
          '<span class="news-item__title">' + titleHtml + '</span>';

    if (source) {
      html += ' <span class="news-item__source">' + source + '</span>';
    }

    html +=
        '</div>' +
        (date ? '<span class="news-item__date">' + escapeHtml(date) + '</span>' : '') +
        (link ? '<a class="news-item__view" href="' + link + '" target="_blank" rel="noopener">Read</a>' : '') +
      '</li>';

    return html;
  }

  function getDistinctYears(items) {
    var seen = {};
    var years = [];
    for (var i = 0; i < items.length; i++) {
      var y = getYearFromDate(items[i].date);
      if (y && !seen[y]) {
        seen[y] = true;
        years.push(y);
      }
    }
    years.sort(function (a, b) { return b - a; });
    return years;
  }

  function filterNews(items, searchTerm, yearFilter) {
    var filtered = [];
    var term = (searchTerm || "").toLowerCase();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (yearFilter && String(getYearFromDate(item.date)) !== String(yearFilter)) {
        continue;
      }

      if (term) {
        var haystack = (
          (item.title || "") + " " +
          (item.source || "")
        ).toLowerCase();
        if (haystack.indexOf(term) === -1) {
          continue;
        }
      }

      filtered.push(item);
    }
    return filtered;
  }

  function renderNewsList(items, searchTerm, yearFilter) {
    if (!items || items.length === 0) {
      return '<div class="news-empty">' +
        '<p>No news items available at this time.</p>' +
      '</div>';
    }

    var years = getDistinctYears(items);
    var filtered = filterNews(items, searchTerm, yearFilter);

    var html =
      '<div class="news-controls">' +
        '<input type="search" id="news-search" class="news-search" placeholder="Search news\u2026" aria-label="Search news"' +
          (searchTerm ? ' value="' + escapeHtml(searchTerm) + '"' : '') + '>' +
        '<select id="news-year-filter" class="news-year-filter" aria-label="Filter by year">' +
          '<option value="">All years</option>';

    for (var i = 0; i < years.length; i++) {
      var selected = String(yearFilter) === String(years[i]) ? ' selected' : '';
      html += '<option value="' + years[i] + '"' + selected + '>' + years[i] + '</option>';
    }

    html +=
        '</select>' +
      '</div>';

    if (filtered.length === 0) {
      html += '<p class="news-no-results">No news items match your search.</p>';
      return html;
    }

    html += '<p class="news-count">' + filtered.length + ' item' + (filtered.length === 1 ? '' : 's') + '</p>';
    html += '<ul class="news-list">';
    for (var j = 0; j < filtered.length; j++) {
      html += renderNewsItem(filtered[j]);
    }
    html += '</ul>';
    return html;
  }

  return {
    escapeHtml: escapeHtml,
    formatDate: formatDate,
    getYearFromDate: getYearFromDate,
    renderNewsItem: renderNewsItem,
    renderNewsList: renderNewsList,
    filterNews: filterNews,
    getDistinctYears: getDistinctYears
  };
})();

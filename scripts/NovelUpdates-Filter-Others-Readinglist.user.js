// ==UserScript==
// @name        Novel Updates Filter Other's Readinglist
// @description Adds a link to user reading lists to remove series with
//              less than 4.5 rating and a link to only show the series that
//              the user is up to date on
// @namespace   https://github.com/nazgand/userscripts
// @version     1
// @grant       none
// @match       http://www.novelupdates.com/readlist/*
// @match       https://www.novelupdates.com/readlist/*
// ==/UserScript==
(function() {
  const table = document.querySelector('table');
  if (!table) {
    throw new Error('could not find series table');
  }

  const span = document.createElement('span');
  span.textContent = 'Min rating:';
  table.parentNode.insertBefore(span, table);

  const minRate = document.createElement('input');
  minRate.type = 'number';
  minRate.step = 0.1;
  minRate.value = 4.5;
  minRate.max = 5;
  minRate.min = 1;
  minRate.style.width = '60px';
  table.parentNode.insertBefore(minRate, table);

  let a = document.createElement('a');
  a.textContent = 'Filter rating';
  a.onclick = function() {
    document.querySelectorAll('td a[href*="www.novelupdates.com/series/"]')
      .forEach(function(el) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          const { response } = this;
          if (response.querySelector('.uvotes').innerHTML
            .split('(')[1].split(' / ')[0] < minRate.value) {
            el.closest('tr').remove();
          }
        };
        xhr.open('GET', el.href);
        xhr.responseType = 'document';
        xhr.send();
      });
  };
  table.parentNode.insertBefore(a, table);

  a = document.createElement('a');
  a.textContent = 'Up to date only';
  a.onclick = function() {
    document.querySelectorAll('td span.cr_status').forEach(function(el) {
      if (el.innerHTML !== el.closest('td').innerHTML
        .split('</span> / ')[1].split(' ]')[0]) {
        el.closest('tr').remove();
      }
    });
  };
  table.parentNode.insertBefore(a, table);
})();

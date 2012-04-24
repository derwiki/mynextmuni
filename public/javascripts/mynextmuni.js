var routes;
$(function() {
  var base = '/nextmuni_api/';
  routes = {
    'Mission Cliffs': [
      {route: 'r=27&d=27_IB1&s=3737&ts=3735', stop: '27 @ 19th/Bryant'},
      {route: 'r=12&d=12_IB1&s=4671&ts=4668', stop: '12 @ 18th/Folsom'},
      {route: 'r=14&d=14_IB1&s=7666&ts=5551', stop: '14 @ 18th/S.Van Ness'}],
    'Causes to Home': [
      {route: 'r=30&d=30_OB3&s=4821&ts=6596', stop: '30 @ Kearny/Geary'},
      {route: 'r=45&d=45_OB2&s=4821&ts=6596', stop: '45 @ Kearny/Geary'},
      {route: 'r=1&d=01_OB09&s=6316&ts=6312', stop: '1 @ Stockton/California'},
      {route: 'r=12&d=12_IB1&s=7549&ts=7550', stop: '12 @ 2nd/Stevenson'},
      {route: 'r=10&d=10_IB1&s=7549&ts=7550', stop: '10 @ 2nd/Stevenson'}],
    'Home to Mission Cliffs': [
      {route: 'r=27&d=27_OB2&s=6919&ts=5068', stop: '27 @ Washington/Hyde'},
      {route: 'r=12&d=12_OB1&s=5841&ts=5857', stop: '12 @ Pacific/Jones'}]
  }

  function renderResults() {
    for (var key in routes) {
      var loc = routes[key];
      document.write(key + '<br>');
      $.each(loc, function(idx, route) {
        document.write([route['stop'], route['prediction']].join(': ') + '<br>');
      });
    }
  }

  var requests = 0;
  $.each(routes, function(idx, loc) {
    $.each(loc, function(idx, route) {
      requests++;
      $.ajax({
        'type': 'GET',
        'url': base + route['route'],
        'dataType': 'json',
        'success': function(predictions) {
          route['prediction'] = predictions.join(', ');
          requests--;
          if (requests === 0) {
            renderResults();
          }
        }
      });
    });
  });
});

// http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
$.urlParam = function(name, querystring){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(querystring);
    if (!results) { return 0; }
    return results[1] || 0;
}

$(function() {
  var d = new Date(),
      seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds(),
      minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
      hours = d.getHours();
  $('#pageRenderInfo span').text([hours, minutes, seconds].join(':'));
  var NEXTMUNI_API_BASE = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&';
  var routes = {
    'Mission Cliffs to Work': [
      {route: 'r=27&d=27_IB1&s=3737&ts=3735', stop: '27 @ 19th/Bryant'},
      {route: 'r=12&d=12_IB1&s=4671&ts=4668', stop: '12 @ 18th/Folsom'},
      {route: 'r=14&d=14_IB1&s=7666&ts=5551', stop: '14 @ 18th/S.Van Ness'}],
    'Work to Home': [
      {route: 'r=30&d=30_OB3&s=4821&ts=6596', stop: '30 @ Kearny/Geary'},
      {route: 'r=45&d=45_OB2&s=4821&ts=6596', stop: '45 @ Kearny/Geary'},
      {route: 'r=1&d=01_OB09&s=6316&ts=6312', stop: '1 @ Stockton/California'},
      {route: 'r=12&d=12_IB1&s=7549&ts=7550', stop: '12 @ 2nd/Stevenson'},
      {route: 'r=10&d=10_IB1&s=7549&ts=7550', stop: '10 @ 2nd/Stevenson'}],
    'Home to Work': [
      {route: 'r=30&d=30_IB1&s=6521&ts=6526', stop: '30 @ Pacific/Stockton'},
      {route: 'r=45&d=45_IB2&s=6521&ts=6526', stop: '45 @ Pacific/Stockton'}],
    'Home to Mission Cliffs': [
      {route: 'r=27&d=27_OB2&s=6919&ts=5068', stop: '27 @ Washington/Hyde'},
      {route: 'r=12&d=12_OB1&s=5841&ts=5857', stop: '12 @ Pacific/Jones'}]
  }

  for (var key in routes) {
    var locations = routes[key];
    var locHTML = $('<div><strong>' + key + '</strong></div>');
    $.each(locations, function(idx, loc) {
      locHTML.append($('<div id="' + rowId(loc) + '">' + loc['stop'] + ': '));
    });
    $('body').append(locHTML);
  }

  function rowId(route) {
	return $.map(['r', 'd', 's', 'ts'], function(k) {
	  return $.urlParam(k, '?' + route['route']);
    }).join("_");
  }
  
  function secondsToDisplay(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds % 60;
    return ["<span class='time'><span class='minutes'>", minutes,
            "</span> min and <span class='seconds'>", seconds,
            "</span> seconds</span>"].join('');
  }

  function refreshPrediction(route) {
    $.ajax({
      'type': 'GET',
      'url': NEXTMUNI_API_BASE + route['route'],
      'dataType': 'xml',
      'success': function(xml) {
        var predictions = $(xml).find('prediction').slice(0, 2);
        var formatted_predictions = $.map(predictions, function(p) {
          return secondsToDisplay($(p).attr('seconds'));
        });
        route['prediction'] = formatted_predictions.join(', ');
        $('#' + rowId(route)).html(route['stop'] + ': ' + route['prediction']);

        var randomDelay = Math.floor(Math.random()*3) * 1000; // msec
        setInterval(function() { refreshPrediction(route); }, randomDelay);
      }
    });
  }

  $.each(routes, function(idx, loc) {
    $.each(loc, function(idx, route) {
      refreshPrediction(route);
    });
  });
});

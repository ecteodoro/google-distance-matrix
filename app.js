var distance = require('./index.js');

var origins = [/*'San Francisco CA',*/ '40.7421,-73.9914'];
var destinations = ['New York NY', 'Ottawa', 'Honolulu'];

function onMatrix(err, distances) {
    if (err) {
        return console.log(err);
    }
    if(!distances) {
        return console.log('no distances');
    }
    if (distances.status == 'OK') {
        for (var i = 0; i < destinations.length; i++) {
            if (distances.rows[0].elements[i].status == 'OK') {
                var distance = distances.rows[0].elements[i].distance.text;
                var origin = distances.origin_addresses[0];
                var destination = distances.destination_addresses[i];
                console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
            } else {
                console.log('Destination is not reachable by land from destination');
            }
        }

    }
}

distance.key('<Your API key here>');
distance.units('imperial');

distance.matrix(origins, destinations, onMatrix);

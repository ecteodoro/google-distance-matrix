var distance = require('./index.js');

var origins = ['San Francisco CA', '40.7421,-73.9914'];
var destinations = ['New York NY', 'Montreal', '41.8337329,-87.7321554', 'Honolulu'];

function onMatrix(err, distances) {
    if (err) {
        // request errors
        return console.log(err);
    }
    if (distances.error_message) {
        // API errors
        return console.log(distances.error_message);
    }
    if(!distances) {
        return console.log('no distances');
    }
    if (distances.status == 'OK') {
        for (var i=0; i < origins.length; i++) {
            for (var j = 0; j < destinations.length; j++) {
                var origin = distances.origin_addresses[i];
                var destination = distances.destination_addresses[j];
                if (distances.rows[0].elements[j].status == 'OK') {
                    var distance = distances.rows[i].elements[j].distance.text;
                    console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                } else {
                    console.log(destination + ' is not reachable by land from ' + origin);
                }
            }

        }

    }
}

//distance.key('<Your API key here>');
distance.units('imperial');

// TRANSIT example

distance.mode('transit');

distance.transit_mode('train');

distance.transit_routing_preference('fewer_transfers');

distance.matrix(origins, destinations, onMatrix);

// DRIVING example

distance.mode('driving');

distance.traffic_model('optimistic');

distance.departure_time(1513362478);

distance.matrix(origins, destinations, onMatrix);

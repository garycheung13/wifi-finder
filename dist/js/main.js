// fetch("https://data.cityofnewyork.us/resource/24t3-xqyv.json?$where=within_circle(location_lat_long,40.605982,%20-73.999860,%201000)")
// .then(res => res.json())
// .then(data => console.log(data))

// function copied from https://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist;
    }
}

// var planes = [
//     ["7C6B07", -40.99497, 174.50808],
//     ["7C6B38", -41.30269, 173.63696],
//     ["7C6CA1", -41.49413, 173.5421],
//     ["7C6CA2", -40.98585, 174.50659],
// ];

var map = L.map('map').setView([40.766526, -73.976472], 15);
mapLink =
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);

// for (var i = 0; i < planes.length; i++) {
//     marker = new L.marker([planes[i][1], planes[i][2]])
//         .bindPopup(planes[i][0])
//         .addTo(map);
// }

let centerCoords = "";

document.getElementById("zip-search").addEventListener("submit", function (e) {
    // prevent the submit refresh
    e.preventDefault();
    // clear previous search information
    document.getElementById("message-entry").innerHTML = "";
    const inputZipCode = document.getElementById("zip-input").value;

    // look up the centroid lat/long for the zip code
    fetch("/nyc_zips.json")
        .then(res => res.json())
        .then(data => {
            const inputCoords = data[inputZipCode];
            // if it was found, procced to lookup the hotspots
            if (inputCoords) {
                centerCoords = inputCoords;
                return fetch(`https://data.cityofnewyork.us/resource/24t3-xqyv.json?$where=within_circle(location_lat_long,${inputCoords[0]},${inputCoords[1]},500)`)
            // if not found throw error
            } else {
                throw new Error("The zip code entered does not return any results");
            }
        })
        .then(res => res.json())
        .then(data => {
            // sort by distance from zip code centroid
            const sortedData = data.sort(function(a, b) {
                const distanceA = distance(centerCoords[0], centerCoords[1], a.latitude, a.longitude);
                const distanceB = distance(centerCoords[0], centerCoords[1], b.latitude, b.longitude);

                return distanceA - distanceB;
            });

            console.log(sortedData);
        })
        .catch(err => {
            const errorTemplate = `
                <div class="content-results__message" id="message">
                    <p>${err.message}</p>
                </div>`
            document.getElementById("message-entry").innerHTML = errorTemplate;
        })

})
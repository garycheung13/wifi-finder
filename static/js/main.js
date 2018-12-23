// lat/lon distance function
// taken from https://www.geodatasource.com/developers/javascript
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

// *** map initial setup
const wifiMarkersGroup = L.featureGroup();
// center the map on central park by default
const map = L.map('map', {
    center: [40.766526, -73.976472],
    zoom: 15,
    layers: [wifiMarkersGroup]
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
        maxZoom: 18,
    }).addTo(map);

let centerCoords = "";
const resultsContainer = document.getElementById("results-container");
const messageEntry = document.getElementById("message-entry");

// make the hotspot search on submit
// if successful, perform DOM changes to display results and perform map changes
// otherwise, show error message
document.getElementById("zip-search").addEventListener("submit", function (e) {
    // prevent the default submit refresh
    e.preventDefault();
    // clear markers from previous search
    wifiMarkersGroup.clearLayers();
    // remove last search's information from DOM
    resultsContainer.innerHTML = "";
    messageEntry.innerHTML = "";

    const inputZipCode = document.getElementById("zip-input").value;

    // look up the centroid lat/long for the zip code from the local json file
    fetch("/nyc_zips.json")
        .then(res => res.json())
        .then(data => {
            const inputCoords = data[inputZipCode];
            // if it was found, proceed to make api call to lookup the hotspot locations
            if (inputCoords) {
                centerCoords = inputCoords; // save new map center
                return fetch(`https://data.cityofnewyork.us/resource/24t3-xqyv.json?$where=within_circle(location_lat_long,${inputCoords[0]},${inputCoords[1]},4000)`)
            } else {
                // if not found throw error
                throw new Error("Your search did not return any results. Please check that you entered a zip code within NYC.");
            }
        })
        .then(res => res.json())
        .then(data => {
            // sort by distance from zip code centroid using the lat/long distance formula
            // then truncate to first five entries
            const sortedData = data.sort(function (a, b) {
                const distanceA = distance(centerCoords[0], centerCoords[1], a.latitude, a.longitude);
                const distanceB = distance(centerCoords[0], centerCoords[1], b.latitude, b.longitude);
                return distanceA - distanceB;
            }).slice(0, 5);

            //hide the placeholder
            document.getElementById("results-placeholder").style.display = "none";

            // create the html for each result and attach to DOM
            resultsContainer.innerHTML = sortedData.map((d, i) => {
                return `
                <div class="results-card">
                    <div class="results-card__primary">
                        <h3>${i + 1}. ${d.name}</h3>
                        <h4>Provided by: ${d.provider}</h4>
                    </div>
                    <div class="results-card__details">
                        <div class="results-card__info">
                            <img src="static/images/location.svg" alt="location icon" class="results-card__icon">
                            ${d.location}
                        </div>
                        <div class="results-card__info">
                            <img src="static/images/ssid.svg" alt="hotspot name" class="results-card__icon">
                            ${d.ssid}
                        </div>
                    </div>
                    <div class="results-card__extras">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${d.latitude},${d.longitude}" target="_blank">Get Directions (Google Maps)</a>
                        <div class="results-card__info">
                            <img src="static/images/info.svg" alt="information icon" class="results-card__icon">${d.type}
                        </div>
                    </div>
                </div>`;
            }).join(''); // empty string join needed for removing commas


            map.panTo(centerCoords, {animate: true});
            // insert data into map as markers
            sortedData.forEach(function(d, i){
                // generate a icon with result number label
                const numberedIcon = L.divIcon({
                    className: "map-number-icon",
                    iconSize: [25, 41],
                    iconAnchor: [10, 44],
                    popupAnchor: [3, -44],
                    html: `<div class="map-number-icon-text">${i + 1}</div>`
                });

                L.marker([d.latitude, d.longitude], {icon: numberedIcon})
                .bindPopup(`${i + 1}. ${d.name} <br> ${d.location} <br> <a href="https://www.google.com/maps/dir/?api=1&destination=${d.latitude},${d.longitude}" target="_blank">Get Directions (Google Maps)</a>`)
                .addTo(wifiMarkersGroup);
            });

            // fit map to markers
            map.fitBounds(wifiMarkersGroup.getBounds());
        })
        .catch(err => {
            messageEntry.innerHTML = `
                <div class="content-results__message" id="message">
                    <p>${err.message}</p>
                </div>`
        })

})
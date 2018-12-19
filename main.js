// fetch("/nyc_zips.json")
// .then(res => res.json())
// .then(data => console.log(data))

fetch("https://data.cityofnewyork.us/resource/24t3-xqyv.json?$where=within_circle(location_lat_long,40.605982,%20-73.999860,%201000)")
.then(res => res.json())
.then(data => console.log(data))
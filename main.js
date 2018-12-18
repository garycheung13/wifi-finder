fetch("/nyc_zips.json")
.then(res => res.json())
.then(data => console.log(data))
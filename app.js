const globe = Globe()(document.getElementById("globe"))

.globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
.backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")

.width(window.innerWidth)
.height(window.innerHeight);

let countriesData = [];
let selectedCountry = null;

globe.controls().autoRotate = true;
globe.controls().autoRotateSpeed = 0.4;


// load country geojson
fetch("./data/countries.json")
.then(res => res.json())
.then(data => {

countriesData = data.features;

globe
.polygonsData(countriesData)

.polygonCapColor(d =>
d === selectedCountry ? "rgba(255,165,0,0.6)" : "rgba(0,0,0,0)"
)

.polygonSideColor(() => "rgba(0,0,0,0)")
.polygonStrokeColor(() => "#ffffff")

.polygonLabel(d => `<b>${d.properties.name}</b>`)

.onPolygonClick(d => {

selectedCountry = d;

globe.polygonCapColor(globe.polygonCapColor());

const name = d.properties.name;

document.getElementById("countryName").innerText = name;


// fetch country info
fetch(`https://restcountries.com/v3.1/name/${name}`)
.then(res => res.json())
.then(info => {

const country = info[0];

document.getElementById("countryFlag").src = country.flags.png;

const capital = country.capital ? country.capital[0] : "Unknown";

document.getElementById("countryInfo").innerText =
"Capital: " + capital +
"\nPopulation: " + country.population.toLocaleString() +
"\nRegion: " + country.region;

});

});

});


// search country
function searchCountry(){

const input =
document.getElementById("countrySearch").value.toLowerCase();

const country = countriesData.find(c =>
c.properties.name.toLowerCase().includes(input)
);

if(!country){
alert("Country not found");
return;
}

selectedCountry = country;

globe.polygonCapColor(globe.polygonCapColor());

const coords = country.geometry.coordinates[0][0];

const lng = coords[0];
const lat = coords[1];

globe.pointOfView({ lat:lat, lng:lng, altitude:1.5 },2000);

}

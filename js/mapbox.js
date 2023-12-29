mapboxgl.accessToken =
	"pk.eyJ1IjoibWFyc2hhamFqYSIsImEiOiJjbGhhcTM2b2owZXRlM2xwY3BnNW83a2ZhIn0.-qRhidP6nwUKEOiCprzmzA";

let map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/streets-v12",
	center: [-0.1276, 51.5072],
	zoom: 13,
});

let userLatitude, userLongitude;

function createCustomIconMarker() {
	var el = document.createElement("div");
	el.style.backgroundImage = "url(./assets/placeholder-marker.png)";
	el.style.width = "30px";
	el.style.height = "30px";
	el.style.backgroundSize = "100% 100%";
	return el;
}

function getUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				userLatitude = position.coords.latitude;
				userLongitude = position.coords.longitude;
				map.flyTo({ center: [userLongitude, userLatitude], zoom: 13 });
				var customIconMarkerEl = createCustomIconMarker();

				const userLocationMarker = new mapboxgl.Marker(customIconMarkerEl)
					.setLngLat([userLongitude, userLatitude])
					.addTo(map);
			},
			() => {
				console.error("Geolocation not supported or permission denied.");
			}
		);
	} else {
		console.error("Geolocation is not supported by this browser.");
	}
}

$("#poi-search-form").submit(function (e) {
	e.preventDefault();
	let searchText = $("#poi-input").val().trim();
	let geocodingURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
		searchText
	)}.json?proximity=${userLongitude},${userLatitude}&access_token=${
		mapboxgl.accessToken
	}`;

	function createCustomIconMarker() {
		var el = document.createElement("div");
		el.style.backgroundImage = "url(./assets/book-marker.png)";
		el.style.width = "40px";
		el.style.height = "40px";
		el.style.backgroundSize = "40px 40px";
		el.style.backgroundRepeat = "no-repeat";
		el.style.backgroundPosition = "center";
		return el;
	}

	fetch(geocodingURL)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			$("#poi-results").empty();
			if (data.features && data.features.length > 0) {
				data.features.forEach((feature) => {
					let placeName = feature.place_name || "No name available";
					let poiDiv = $("<div>").append($("<h3>").text(placeName));
					$("#poi-results").append(poiDiv);

					var customIconMarker = createCustomIconMarker();

					new mapboxgl.Marker(customIconMarker)
						.setLngLat(feature.geometry.coordinates)
						.setPopup(new mapboxgl.Popup().setText(placeName))
						.addTo(map);

					map.flyTo({
						center: feature.geometry.coordinates,
						zoom: 11,
						essential: true,
					});
				});
			} else {
				console.log("No results found");
			}
		})
		.catch((error) => console.error("Error:", error));
});

$(document).ready(function () {
	getUserLocation();
});

mapboxgl.accessToken =
	"pk.eyJ1IjoibWFyc2hhamFqYSIsImEiOiJjbGhhcTM2b2owZXRlM2xwY3BnNW83a2ZhIn0.-qRhidP6nwUKEOiCprzmzA";

//map from mapbox display city of london onload
let map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/streets-v12",
	center: [-0.121231, 51.514383],
	zoom: 13,
});

// Function creates a custom icon marker for user's location on the map
function createCustomIconMarker(imageUrl) {
	const el = document.createElement("div");
	el.style.backgroundImage = `url(${imageUrl})`;
	el.style.width = "40px";
	el.style.height = "40px";
	el.style.backgroundSize = "100% 100%";
	return el;
}

let userLatitude, userLongitude;

// Function get user location based on coordinates - using the browers built-in getCurrentPosition - user need to allow access
function getUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				userLatitude = position.coords.latitude;
				userLongitude = position.coords.longitude;
				setMapCenter(userLatitude, userLongitude);
				addMarkerToMap(
					userLatitude,
					userLongitude,
					"./assets/placeholder-marker.png"
				);
			},
			() => {
				console.error("Geolocation not supported or permission denied.");
			}
		);
	} else {
		console.error("Geolocation is not supported by this browser.");
	}
}

// Function  to center map based on coordinates gained from user
function setMapCenter(latitude, longitude) {
	map.flyTo({ center: [longitude, latitude], zoom: 13 });
}

// Function add marker to map for user positions
function addMarkerToMap(latitude, longitude, markerImageUrl) {
	const customIconMarkerEl = createCustomIconMarker(markerImageUrl);
	new mapboxgl.Marker(customIconMarkerEl)
		.setLngLat([longitude, latitude])
		.addTo(map);
}

// Function calls mapbox api to find near by bookstores/ bookshops
function handlePlaceSearch(searchText) {
	const geocodingURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
		searchText
	)}.json?proximity=${userLongitude},${userLatitude}&access_token=${
		mapboxgl.accessToken
	}`;
	fetch(geocodingURL)
		.then((response) => response.json())
		.then((data) => processSearchResults(data))
		.catch((error) => console.error("Error:", error));
}

// Function to process and display search results
function processSearchResults(data) {
	$("#place-search-results").empty();

	// looking for place nearby and splitting the address for .slice() use  in next part
	if (data.features && data.features.length > 0) {
		data.features.forEach((feature) => {
			const fullAddress = feature.place_name || "No name available";
			const addressParts = fullAddress.split(", ");
			const title = addressParts[0];
			const restOfAddress = addressParts.slice(1);

			// Create the card for each place and using .slice() to better display the address nicer on the cards
			const columnDiv = $("<div>").addClass("col-md");
			const placeResultDiv = $("<div>")
				.addClass("card")
				.css({ margin: "5px", width: "25rem" });
			const cardBody = $("<div>").addClass("card-body").css({ margin: "10px" });
			const bookstoreTitle = $("<h5>").addClass("card-title").text(title);
			const cardAddress = $("<p>")
				.addClass("card-text")
				.text(restOfAddress.slice(0, -1).join(", "));
			const cardPostcode = $("<p>")
				.addClass("card-text")
				.text(restOfAddress.slice(-1));

			cardBody.append(bookstoreTitle, cardAddress, cardPostcode);
			placeResultDiv.append(cardBody);
			columnDiv.append(placeResultDiv);
			$("#place-search-results").append(columnDiv);

			// Creates and add marker for each search result on the mapbox map
			const customIconMarker = createCustomIconMarker(
				"./assets/book-marker.png"
			);
			new mapboxgl.Marker(customIconMarker)
				.setLngLat(feature.geometry.coordinates)
				.setPopup(new mapboxgl.Popup().setText(fullAddress))
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
}

// from submit
$("#poi-search-form").submit(function (e) {
	e.preventDefault();
	const searchText = $("#place-search-input").val().trim();
	handlePlaceSearch(searchText);
	$("#place-search-input").val("");
});

$(document).ready(function () {
	getUserLocation();
});

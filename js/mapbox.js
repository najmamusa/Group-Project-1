mapboxgl.accessToken =
	"pk.eyJ1IjoibWFyc2hhamFqYSIsImEiOiJjbGhhcTM2b2owZXRlM2xwY3BnNW83a2ZhIn0.-qRhidP6nwUKEOiCprzmzA";

let map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/streets-v12",
	center: [-0.121231, 51.514383],
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
	let searchText = $("#place-search-input").val().trim();
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
			let rowDiv = $("<div>").addClass("row");
			$("#place-search-input").val("");
			$("#place-search-results").empty().append(rowDiv);
			if (data.features && data.features.length > 0) {
				data.features.forEach((feature) => {
					let fullAddress = feature.place_name || "No name available";
					let addressParts = fullAddress.split(", ");
					let title = addressParts[0];
					let restOfAddress = addressParts.slice(1);

					let columnDiv = $("<div>").addClass("col-md");
					let placeResultDiv = $("<div>")
						.addClass("card")
						.css({ margin: "5px", width: "25rem" });
					let cardBody = $("<div>")
						.addClass("card-body")
						.css({ margin: "10px" });
					let bookstoreTitle = $("<h5>").addClass("card-title").text(title);
					let cardAddress = $("<p>")
						.addClass("card-text")
						.text(restOfAddress.slice(0, -1).join(", "));
					let cardPostcode = $("<p>")
						.addClass("card-text")
						.text(restOfAddress.slice(-1));

					cardBody.append(bookstoreTitle, cardAddress, cardPostcode);
					placeResultDiv.append(cardBody);
					columnDiv.append(placeResultDiv);
					rowDiv.append(columnDiv);

					//NoTE LIST ITEM DISPLAY BELOW

					// let columnDiv = $("<div>").addClass("col-sm");
					// let placeResultDiv = $("<div>")
					// 	.addClass("card")
					// 	.css({ margin: "10px", width: "18rem" });
					// let listGroup = $("<div>").addClass("list-group list-group-flush");
					// let listItemTitle = $("<div>")
					// 	.addClass("list-group-item")
					// 	.text(title);
					// let listItem1 = $("<div>")
					// 	.addClass("list-group-item")
					// 	.text(restOfAddress.slice(0, -1).join(", "));
					// let listItem2 = $("<div>")
					// 	.addClass("list-group-item")
					// 	.text(restOfAddress.slice(-1));

					// listGroup.append(listItemTitle, listItem1, listItem2);
					// placeResultDiv.append(listGroup);
					// columnDiv.append(placeResultDiv);
					// rowDiv.append(columnDiv);

					let customIconMarker = createCustomIconMarker();

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
		})
		.catch((error) => console.error("Error:", error));
});

$(document).ready(function () {
	getUserLocation();
});

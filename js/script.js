function fetchBestsellersBooks() {
	let apiKey = "2S2xIryPnZ6hWb0XnN6SXQmaZWOa6XAa";
	let url = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			if (data.results && data.results.books) {
				updateCarousel(data.results.books);
			}
		})
		.catch((error) => console.error("Error:", error));
}

function updateCarousel(books) {
	let carouselContainer = $("#carouselExample .carousel-inner");
	carouselContainer.empty();

	books.forEach((book, index) => {
		let isActive;
		if (index === 0) {
			isActive = "active";
		} else {
			isActive = "";
		}
		let carouselItem = $(`
            <div class="carousel-item ${isActive}">
                <img src="${book.book_image}" class="d-block w-100" alt="${book.title}" />
                <div class="carousel-caption d-none d-md-block">
                    <h5>${book.title}</h5>
                    <p>${book.description}</p>
                </div>
            </div>
        `);

		carouselContainer.append(carouselItem);
	});
}

$(document).ready(function () {
	fetchBestsellersBooks();
});

// $("#book-search-form").submit(function (e) {
// 	e.preventDefault();

// 	let searchTermValue = $("#search-term").val().trim();
// 	if (!searchTermValue) {
// 		console.log("No search term provided");
// 		return;
// 	}

// 	let queryURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
// 		searchTermValue
// 	)}&key=AIzaSyBG54r1IMAcrbAdHjU8BR_otxstaWVMF-8`;

// 	fetch(queryURL)
// 		.then((response) => response.json())
// 		.then((data) => {
// 			console.log(data);
// 			if (data.items) {
// 				$("#book-results").empty();
// 				data.items.forEach((item) => {
// 					if (item.volumeInfo) {
// 						let title = item.volumeInfo.title || "No title available";
// 						let description =
// 							item.searchInfo && item.searchInfo.textSnippet
// 								? item.searchInfo.textSnippet
// 								: "No description available";
// 						let thumbnail = item.volumeInfo.imageLinks
// 							? item.volumeInfo.imageLinks.smallThumbnail
// 							: "path_to_default_image.jpg";

// 						let column = $("<div>").addClass("col-md-4");
// 						let card = $("<div>").addClass("card").css("border", "none");
// 						let imgElement = $("<img>")
// 							.addClass("card-img-top")
// 							.attr("src", thumbnail)
// 							.attr("alt", title)
// 							.css({ "max-height": "350px", "object-fit": "contain" });
// 						let cardBody = $("<div>").addClass("card-body");
// 						let titleElement = $("<h5>").addClass("card-title").text(title);
// 						let descriptionElement = $("<p>")
// 							.addClass("card-text")
// 							.text(description);
// 						let linkElement = $("<a>")
// 							.attr("href", item.volumeInfo.infoLink)
// 							.addClass("btn btn-primary")
// 							.text("Learn More");

// 						cardBody.append(titleElement);
// 						cardBody.append(imgElement);
// 						cardBody.append(descriptionElement);
// 						cardBody.append(linkElement);

// 						card.append(cardBody);
// 						column.append(card);
// 						$("#book-results").append(column);
// 					}
// 				});
// 			} else {
// 				console.log("No books found for the search term");
// 			}
// 		})
// 		.catch((error) => console.error("Error:", error));
// });

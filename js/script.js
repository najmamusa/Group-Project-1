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

//note  create and populate the carousel with api data
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

//note fetching the bestsellers on page load
$(document).ready(function () {
	fetchBestsellersBooks();
});
//note DISPLAYING CURRENT YEAR VIA DATE.js
function updateCurrentYear() {
	$("#current-year").text(new Date().getFullYear());
}
